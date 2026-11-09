import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { JobStatus, Prisma } from '@prisma/client';
import type {
  TCreateJobInputData,
  TUpdateJobInputData,
  TUpsertJobTranslationInputData,
} from '@pipeline/contracts';

interface FindAllJobsOptions {
  locale?: string;
  department?: string;
  includeUnpublished?: boolean;
}

@Injectable()
export class JobsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(options: FindAllJobsOptions = {}) {
    const { locale = 'en', department, includeUnpublished = false } = options;

    const jobs = await this.prisma.job.findMany({
      where: {
        ...(!includeUnpublished && { status: JobStatus.PUBLISHED }),
        ...(department && { department: department as any }),
      },
      include: {
        translations: { where: { locale } },
      },
      orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
    });

    return jobs.filter((j) => j.translations.length > 0);
  }

  async findOneBySlug(slug: string, locale = 'en') {
    const job = await this.prisma.job.findFirst({
      where: { slug, status: JobStatus.PUBLISHED },
      include: {
        translations: { where: { locale } },
      },
    });

    if (!job || job.translations.length === 0) {
      throw new NotFoundException(`Job "${slug}" not found`);
    }

    return job;
  }

  async findAllAdmin() {
    return this.prisma.job.findMany({
      include: { translations: true },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const job = await this.prisma.job.findUnique({
      where: { id },
      include: { translations: true },
    });

    if (!job) {
      throw new NotFoundException(`Job with ID "${id}" not found`);
    }

    return job;
  }

  async create(data: TCreateJobInputData, authorId: string) {
    const existing = await this.prisma.job.findUnique({
      where: { slug: data.slug },
    });
    if (existing) {
      throw new ConflictException(`Slug "${data.slug}" is already taken`);
    }

    const isPublished = data.status === 'PUBLISHED';

    const job = await this.prisma.job.create({
      data: {
        slug: data.slug,
        department: data.department,
        level: data.level,
        type: data.type,
        location: data.location,
        icon: data.icon,
        status: data.status,
        publishedAt: isPublished ? new Date() : null,
        authorId,
        translations: {
          create: data.translations,
        },
      },
      include: { translations: true },
    });

    return job;
  }

  async update(id: string, data: TUpdateJobInputData) {
    await this.findOne(id);

    if (data.slug) {
      const existing = await this.prisma.job.findFirst({
        where: {
          slug: data.slug,
          NOT: { id },
        },
      });
      if (existing) {
        throw new ConflictException(`Slug "${data.slug}" is already taken`);
      }
    }

    const updateData: Prisma.JobUpdateInput = {
      ...(data.slug !== undefined && { slug: data.slug }),
      ...(data.department !== undefined && { department: data.department }),
      ...(data.level !== undefined && { level: data.level }),
      ...(data.type !== undefined && { type: data.type }),
      ...(data.location !== undefined && { location: data.location }),
      ...(data.icon !== undefined && { icon: data.icon }),
      ...(data.status !== undefined && { status: data.status }),
      ...(data.status === 'PUBLISHED' && { publishedAt: new Date() }),
    };

    return this.prisma.job.update({
      where: { id },
      data: updateData,
      include: { translations: true },
    });
  }

  async publish(id: string) {
    await this.findOne(id);
    return this.prisma.job.update({
      where: { id },
      data: { status: JobStatus.PUBLISHED, publishedAt: new Date() },
      include: { translations: true },
    });
  }

  async archive(id: string) {
    await this.findOne(id);
    return this.prisma.job.update({
      where: { id },
      data: { status: JobStatus.ARCHIVED },
      include: { translations: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.job.delete({ where: { id } });
  }

  async upsertTranslation(jobId: string, data: TUpsertJobTranslationInputData) {
    await this.findOne(jobId);

    return this.prisma.jobTranslation.upsert({
      where: { jobId_locale: { jobId, locale: data.locale } },
      create: {
        jobId,
        locale: data.locale,
        title: data.title,
        description: data.description,
        responsibilities: data.responsibilities,
        requirements: data.requirements,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
      },
      update: {
        title: data.title,
        description: data.description,
        responsibilities: data.responsibilities,
        requirements: data.requirements,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
      },
    });
  }

  async removeTranslation(jobId: string, locale: string) {
    const translation = await this.prisma.jobTranslation.findUnique({
      where: { jobId_locale: { jobId, locale } },
    });
    if (!translation) {
      throw new NotFoundException(`Translation "${locale}" for job "${jobId}" not found`);
    }
    return this.prisma.jobTranslation.delete({
      where: { jobId_locale: { jobId, locale } },
    });
  }
}
