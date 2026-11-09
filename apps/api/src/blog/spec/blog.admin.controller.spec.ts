import { Test, TestingModule } from '@nestjs/testing';
import { AdminBlogController } from '../blog.admin.controller';
import { BlogService } from '../blog.service';
import type { TUserSafe } from '@/auth/types/auth.types';

const mockBlogService = {
  findAllAdmin: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  publish: jest.fn(),
  archive: jest.fn(),
  remove: jest.fn(),
};

const mockUser = { id: 'user-1', email: 'admin@example.com', role: 'SUPER_ADMIN' } as TUserSafe;

describe('AdminBlogController', () => {
  let controller: AdminBlogController;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminBlogController],
      providers: [{ provide: BlogService, useValue: mockBlogService }],
    }).compile();

    controller = module.get<AdminBlogController>(AdminBlogController);
  });

  describe('findAll', () => {
    it('delegates to blogService.findAllAdmin', async () => {
      const posts = [{ id: 'post-1' }];
      mockBlogService.findAllAdmin.mockResolvedValue(posts);

      const result = await controller.findAll();

      expect(mockBlogService.findAllAdmin).toHaveBeenCalled();
      expect(result).toEqual(posts);
    });
  });

  describe('findOne', () => {
    it('delegates to blogService.findOne with id', async () => {
      const post = { id: 'post-1', slug: 'first-post' };
      mockBlogService.findOne.mockResolvedValue(post);

      const result = await controller.findOne('post-1');

      expect(mockBlogService.findOne).toHaveBeenCalledWith('post-1');
      expect(result).toEqual(post);
    });
  });

  describe('create', () => {
    it('delegates to blogService.create with dto and user.id', async () => {
      const dto = {
        slug: 'new-post',
        status: 'PUBLISHED',
        translations: [],
      } as any;
      const created = { id: 'post-2', slug: 'new-post' };
      mockBlogService.create.mockResolvedValue(created);

      const result = await controller.create(dto, mockUser);

      expect(mockBlogService.create).toHaveBeenCalledWith(dto, 'user-1');
      expect(result).toEqual(created);
    });
  });

  describe('update', () => {
    it('delegates to blogService.update', async () => {
      const dto = { title: 'Updated' } as any;
      const updated = { id: 'post-1', title: 'Updated' };
      mockBlogService.update.mockResolvedValue(updated);

      const result = await controller.update('post-1', dto);

      expect(mockBlogService.update).toHaveBeenCalledWith('post-1', dto);
      expect(result).toEqual(updated);
    });
  });

  describe('publish', () => {
    it('delegates to blogService.publish', async () => {
      const updated = { id: 'post-1', status: 'PUBLISHED' };
      mockBlogService.publish.mockResolvedValue(updated);

      const result = await controller.publish('post-1');

      expect(mockBlogService.publish).toHaveBeenCalledWith('post-1');
      expect(result).toEqual(updated);
    });
  });

  describe('archive', () => {
    it('delegates to blogService.archive', async () => {
      const updated = { id: 'post-1', status: 'ARCHIVED' };
      mockBlogService.archive.mockResolvedValue(updated);

      const result = await controller.archive('post-1');

      expect(mockBlogService.archive).toHaveBeenCalledWith('post-1');
      expect(result).toEqual(updated);
    });
  });

  describe('remove', () => {
    it('delegates to blogService.remove', async () => {
      mockBlogService.remove.mockResolvedValue({ id: 'post-1' });

      await controller.remove('post-1');

      expect(mockBlogService.remove).toHaveBeenCalledWith('post-1');
    });
  });
});
