import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { PostStatus } from '@prisma/client';
import { BlogService } from '../blog.service';
import { PrismaService } from '@/prisma/prisma.service';
import type { TCreatePostInputData, TUpdatePostInputData } from '@pipeline/contracts';

const mockPrismaService = {
  post: {
    findMany: jest.fn(),
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  postTranslation: {
    upsert: jest.fn(),
    deleteMany: jest.fn(),
  },
  $transaction: jest.fn((cb) => cb(mockPrismaService)),
};

const createMockPost = (overrides: Record<string, unknown> = {}) => ({
  id: 'post-1',
  slug: 'first-post',
  status: PostStatus.PUBLISHED,
  coverImage: '/uploads/cover.png',
  authorId: 'user-1',
  publishedAt: new Date('2026-01-01'),
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
  translations: [
    {
      id: 'tr-1',
      postId: 'post-1',
      locale: 'en',
      title: 'First Post',
      excerpt: 'This is a short excerpt',
      content: 'Full content here...',
      metaTitle: null,
      metaDescription: null,
    },
  ],
  ...overrides,
});

describe('BlogService', () => {
  let service: BlogService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BlogService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<BlogService>(BlogService);
  });

  describe('findAll', () => {
    it('returns only published posts that have translations', async () => {
      const posts = [
        createMockPost(),
        createMockPost({ id: 'post-2', slug: 'draft-post', translations: [] }),
      ];
      mockPrismaService.post.findMany.mockResolvedValue(posts);

      const result = await service.findAll();

      expect(mockPrismaService.post.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { status: PostStatus.PUBLISHED },
        }),
      );
      expect(result).toHaveLength(1);
      expect(result[0].slug).toBe('first-post');
    });

    it('includes unpublished posts when includeUnpublished is true', async () => {
      mockPrismaService.post.findMany.mockResolvedValue([]);
      await service.findAll({ includeUnpublished: true });

      expect(mockPrismaService.post.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {},
        }),
      );
    });
  });

  describe('findOneBySlug', () => {
    it('returns post when found and published', async () => {
      mockPrismaService.post.findFirst.mockResolvedValue(createMockPost());

      const result = await service.findOneBySlug('first-post');

      expect(mockPrismaService.post.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { slug: 'first-post', status: PostStatus.PUBLISHED },
        }),
      );
      expect(result.slug).toBe('first-post');
    });

    it('throws NotFoundException when post missing', async () => {
      mockPrismaService.post.findFirst.mockResolvedValue(null);
      await expect(service.findOneBySlug('missing')).rejects.toThrow(NotFoundException);
    });

    it('throws NotFoundException when post has no translations', async () => {
      mockPrismaService.post.findFirst.mockResolvedValue(createMockPost({ translations: [] }));
      await expect(service.findOneBySlug('first-post')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAllAdmin', () => {
    it('returns all posts without status filter', async () => {
      mockPrismaService.post.findMany.mockResolvedValue([]);
      await service.findAllAdmin();
      expect(mockPrismaService.post.findMany).toHaveBeenCalledWith({
        include: { translations: true },
        orderBy: { updatedAt: 'desc' },
      });
    });
  });

  describe('findOne', () => {
    it('returns post by id or throws NotFound', async () => {
      mockPrismaService.post.findUnique.mockResolvedValue(createMockPost());
      const result = await service.findOne('post-1');
      expect(result.id).toBe('post-1');

      mockPrismaService.post.findUnique.mockResolvedValue(null);
      await expect(service.findOne('missing')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    const createInput: TCreatePostInputData = {
      slug: 'new-post',
      status: 'PUBLISHED',
      coverImage: null,
      translations: [
        {
          locale: 'en',
          title: 'New Post',
          excerpt: 'Short description',
          content: 'Full content body',
        },
      ],
    };

    it('creates post with translations and sets publishedAt', async () => {
      mockPrismaService.post.findUnique.mockResolvedValue(null);
      mockPrismaService.post.create.mockResolvedValue(createMockPost({ slug: 'new-post' }));

      const result = await service.create(createInput, 'user-1');

      expect(mockPrismaService.post.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          slug: 'new-post',
          status: 'PUBLISHED',
          authorId: 'user-1',
          publishedAt: expect.any(Date),
          translations: { create: createInput.translations },
        }),
        include: { translations: true },
      });
      expect(result.slug).toBe('new-post');
    });

    it('throws ConflictException when slug is taken', async () => {
      mockPrismaService.post.findUnique.mockResolvedValue(createMockPost());
      await expect(service.create(createInput, 'user-1')).rejects.toThrow(ConflictException);
    });
  });

  describe('update', () => {
    it('updates post and handles translations atomically', async () => {
      mockPrismaService.post.findUnique.mockResolvedValue(createMockPost());

      const input: TUpdatePostInputData = {
        status: 'PUBLISHED',
        translations: [
          { locale: 'en', title: 'Updated EN', excerpt: 'Desc', content: 'Body' },
          { locale: 'ua', title: 'Оновлено UA', excerpt: 'Опис', content: 'Тіло' },
        ],
      };

      await service.update('post-1', input);

      expect(mockPrismaService.post.update).toHaveBeenCalled();
      expect(mockPrismaService.postTranslation.upsert).toHaveBeenCalledTimes(2);
      expect(mockPrismaService.postTranslation.deleteMany).toHaveBeenCalledWith({
        where: { postId: 'post-1', locale: { notIn: ['en', 'ua'] } },
      });
    });

    it('deletes translations that are missing in the payload', async () => {
      mockPrismaService.post.findUnique.mockResolvedValue(createMockPost());

      const input: TUpdatePostInputData = {
        translations: [
          { locale: 'en', title: 'Only EN', excerpt: 'Desc', content: 'Body' },
        ],
      };

      await service.update('post-1', input);

      expect(mockPrismaService.postTranslation.deleteMany).toHaveBeenCalledWith({
        where: { postId: 'post-1', locale: { notIn: ['en'] } },
      });
    });

    it('throws ConflictException when new slug is taken', async () => {
      mockPrismaService.post.findUnique.mockResolvedValue(createMockPost());
      mockPrismaService.post.findFirst.mockResolvedValue(createMockPost({ id: 'other' }));

      await expect(service.update('post-1', { slug: 'taken' })).rejects.toThrow(ConflictException);
    });
  });

  describe('publish', () => {
    it('sets status to PUBLISHED and updates publishedAt', async () => {
      mockPrismaService.post.findUnique.mockResolvedValue(createMockPost({ status: 'DRAFT' }));
      await service.publish('post-1');

      expect(mockPrismaService.post.update).toHaveBeenCalledWith({
        where: { id: 'post-1' },
        data: { status: PostStatus.PUBLISHED, publishedAt: expect.any(Date) },
        include: { translations: true },
      });
    });
  });

  describe('archive', () => {
    it('sets status to ARCHIVED', async () => {
      mockPrismaService.post.findUnique.mockResolvedValue(createMockPost());
      await service.archive('post-1');

      expect(mockPrismaService.post.update).toHaveBeenCalledWith({
        where: { id: 'post-1' },
        data: { status: PostStatus.ARCHIVED },
        include: { translations: true },
      });
    });
  });

  describe('remove', () => {
    it('deletes post', async () => {
      mockPrismaService.post.findUnique.mockResolvedValue(createMockPost());
      await service.remove('post-1');
      expect(mockPrismaService.post.delete).toHaveBeenCalledWith({ where: { id: 'post-1' } });
    });
  });
});