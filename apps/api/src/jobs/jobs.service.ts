import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { JobDepartment, JobStatus } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';
import { PortalRevalidateService } from '@/portal-revalidate/portal-revalidate.service';
import type {
  TCreateJobInputData,
  TUpdateJobInputData,
  TUpsertJobTranslationInputData,
} from '@pipeline/contracts';

interface IFindAllJobsOptions {
  locale?: string;
  department?: string;
  includeUnpublished?: boolean;
}

@Injectable()
export class JobsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly revalidate: PortalRevalidateService,
  ) {}

  async findAll(options: IFindAllJobsOptions = {}) {
    const { department, includeUnpublished = false } = options;

    const jobs = await this.prisma.job.findMany({
      where: {
        ...(!includeUnpublished && { status: JobStatus.PUBLISHED }),
        ...(department && { department: department as JobDepartment }),
      },
      include: {
        translations: true,
      },
      orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
    });

    return jobs.filter((j) => j.translations.length > 0);
  }

  async findOneBySlug(slug: string, _locale?: string) {
    const job = await this.prisma.job.findFirst({
      where: { slug, status: JobStatus.PUBLISHED },
      include: {
        translations: true,
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

    this.revalidate.scheduleRevalidate(['jobs']);
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

    const { translations, ...rootData } = data;

    const job = await this.prisma.$transaction(async (tx) => {
      await tx.job.update({
        where: { id },
        data: {
          ...rootData,
          ...(rootData.status === 'PUBLISHED' && { publishedAt: new Date() }),
        },
      });

      if (translations) {
        const incomingLocales = translations.map((t) => t.locale);

        for (const tr of translations) {
          await tx.jobTranslation.upsert({
            where: { jobId_locale: { jobId: id, locale: tr.locale } },
            create: { jobId: id, ...tr },
            update: {
              title: tr.title,
              description: tr.description,
              responsibilities: tr.responsibilities,
              requirements: tr.requirements,
              metaTitle: tr.metaTitle,
              metaDescription: tr.metaDescription,
            },
          });
        }

        await tx.jobTranslation.deleteMany({
          where: {
            jobId: id,
            locale: { notIn: incomingLocales },
          },
        });
      }

      return tx.job.findUnique({
        where: { id },
        include: { translations: true },
      });
    });

    this.revalidate.scheduleRevalidate(['jobs']);
    return job;
  }

  async publish(id: string) {
    await this.findOne(id);
    const job = await this.prisma.job.update({
      where: { id },
      data: { status: JobStatus.PUBLISHED, publishedAt: new Date() },
      include: { translations: true },
    });

    this.revalidate.scheduleRevalidate(['jobs']);
    return job;
  }

  async archive(id: string) {
    await this.findOne(id);
    const job = await this.prisma.job.update({
      where: { id },
      data: { status: JobStatus.ARCHIVED },
      include: { translations: true },
    });

    this.revalidate.scheduleRevalidate(['jobs']);
    return job;
  }

  async remove(id: string) {
    await this.findOne(id);
    const job = await this.prisma.job.delete({ where: { id } });

    this.revalidate.scheduleRevalidate(['jobs']);
    return job;
  }

  async upsertTranslation(jobId: string, data: TUpsertJobTranslationInputData) {
    await this.findOne(jobId);
    const translation = await this.prisma.jobTranslation.upsert({
      where: { jobId_locale: { jobId, locale: data.locale } },
      create: { jobId, ...data },
      update: {
        title: data.title,
        description: data.description,
        responsibilities: data.responsibilities,
        requirements: data.requirements,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
      },
    });

    this.revalidate.scheduleRevalidate(['jobs']);
    return translation;
  }

  async removeTranslation(jobId: string, locale: string) {
    const translation = await this.prisma.jobTranslation.findUnique({
      where: { jobId_locale: { jobId, locale } },
    });
    if (!translation) {
      throw new NotFoundException(`Translation "${locale}" for job "${jobId}" not found`);
    }

    const removed = await this.prisma.jobTranslation.delete({
      where: { jobId_locale: { jobId, locale } },
    });

    this.revalidate.scheduleRevalidate(['jobs']);
    return removed;
  }

  async incrementViews(id: string) {
    return this.prisma.job.update({
      where: { id },
      data: { views: { increment: 1 } },
    });
  }

  async incrementApplications(id: string) {
    return this.prisma.job.update({
      where: { id },
      data: { applications: { increment: 1 } },
    });
  }
}
