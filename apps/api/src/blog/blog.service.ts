import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { PostStatus } from '@prisma/client';
import type { TCreatePostInputData, TUpdatePostInputData } from '@pipeline/contracts';

interface FindAllPostsOptions {
  locale?: string;
  includeUnpublished?: boolean;
}

@Injectable()
export class BlogService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(options: FindAllPostsOptions = {}) {
    const { includeUnpublished = false } = options;

    const posts = await this.prisma.post.findMany({
      where: {
        ...(!includeUnpublished && { status: PostStatus.PUBLISHED }),
      },
      include: {
        translations: true,
        author: {
          select: {
            id: true,
            profile: { select: { firstName: true, lastName: true, avatarUrl: true } },
          },
        },
      },
      orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
    });

    return posts.filter((p) => p.translations.length > 0);
  }

  async findOneBySlug(slug: string, _locale?: string) {
    const post = await this.prisma.post.findFirst({
      where: { slug, status: PostStatus.PUBLISHED },
      include: {
        translations: true,
        author: {
          select: {
            id: true,
            profile: { select: { firstName: true, lastName: true, avatarUrl: true } },
          },
        },
      },
    });

    if (!post || post.translations.length === 0) {
      throw new NotFoundException(`Post "${slug}" not found`);
    }

    return post;
  }

  async findAllAdmin() {
    return this.prisma.post.findMany({
      include: { translations: true },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: { translations: true },
    });

    if (!post) {
      throw new NotFoundException(`Post with ID "${id}" not found`);
    }

    return post;
  }

  async create(data: TCreatePostInputData, authorId: string) {
    const existing = await this.prisma.post.findUnique({
      where: { slug: data.slug },
    });
    if (existing) {
      throw new ConflictException(`Slug "${data.slug}" is already taken`);
    }

    const isPublished = data.status === 'PUBLISHED';

    return this.prisma.post.create({
      data: {
        slug: data.slug,
        coverImage: data.coverImage,
        status: data.status,
        publishedAt: isPublished ? new Date() : null,
        authorId,
        translations: {
          create: data.translations,
        },
      },
      include: { translations: true },
    });
  }

  async update(id: string, data: TUpdatePostInputData) {
    await this.findOne(id);

    if (data.slug) {
      const existing = await this.prisma.post.findFirst({
        where: { slug: data.slug, NOT: { id } },
      });
      if (existing) {
        throw new ConflictException(`Slug "${data.slug}" is already taken`);
      }
    }

    const { translations, ...rootData } = data;

    return this.prisma.$transaction(async (tx) => {
      await tx.post.update({
        where: { id },
        data: {
          ...rootData,
          ...(rootData.status === 'PUBLISHED' && { publishedAt: new Date() }),
        },
      });

      if (translations) {
        const incomingLocales = translations.map((t) => t.locale);

        for (const tr of translations) {
          await tx.postTranslation.upsert({
            where: { postId_locale: { postId: id, locale: tr.locale } },
            create: { postId: id, ...tr },
            update: {
              title: tr.title,
              excerpt: tr.excerpt,
              content: tr.content,
              metaTitle: tr.metaTitle,
              metaDescription: tr.metaDescription,
            },
          });
        }

        await tx.postTranslation.deleteMany({
          where: {
            postId: id,
            locale: { notIn: incomingLocales },
          },
        });
      }

      return tx.post.findUnique({
        where: { id },
        include: { translations: true },
      });
    });
  }

  async publish(id: string) {
    await this.findOne(id);
    return this.prisma.post.update({
      where: { id },
      data: { status: PostStatus.PUBLISHED, publishedAt: new Date() },
      include: { translations: true },
    });
  }

  async archive(id: string) {
    await this.findOne(id);
    return this.prisma.post.update({
      where: { id },
      data: { status: PostStatus.ARCHIVED },
      include: { translations: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.post.delete({ where: { id } });
  }
}
