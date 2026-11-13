import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { JobStatus } from '@prisma/client';
import { JobsService } from '../jobs.service';
import { PrismaService } from '@/prisma/prisma.service';
import { PortalRevalidateService } from '@/portal-revalidate/portal-revalidate.service';
import type {
  TCreateJobInputData,
  TUpdateJobInputData,
  TUpsertJobTranslationInputData,
} from '@pipeline/contracts';

const mockPrismaService = {
  job: {
    findMany: jest.fn(),
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  jobTranslation: {
    upsert: jest.fn(),
    findUnique: jest.fn(),
    delete: jest.fn(),
    deleteMany: jest.fn(),
  },
  $transaction: jest.fn((cb) => cb(mockPrismaService)),
};

const mockPortalRevalidateService = {
  scheduleRevalidate: jest.fn(),
};

const createMockJob = (overrides: Record<string, unknown> = {}) => ({
  id: 'job-1',
  slug: 'senior-frontend',
  status: JobStatus.PUBLISHED,
  department: 'ENGINEERING',
  level: 'SENIOR',
  type: 'FULL_TIME',
  location: 'Remote',
  icon: 'code-2',
  authorId: 'user-1',
  publishedAt: new Date('2026-01-01'),
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
  translations: [
    {
      id: 'tr-1',
      jobId: 'job-1',
      locale: 'en',
      title: 'Senior Frontend',
      description: 'Desc',
      responsibilities: [],
      requirements: [],
      metaTitle: null,
      metaDescription: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  ...overrides,
});

describe('JobsService', () => {
  let service: JobsService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobsService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: PortalRevalidateService, useValue: mockPortalRevalidateService },
      ],
    }).compile();

    service = module.get<JobsService>(JobsService);
  });

  describe('create — draft branch', () => {
    it('sets publishedAt to null when status is not PUBLISHED', async () => {
      mockPrismaService.job.findUnique.mockResolvedValue(null);
      mockPrismaService.job.create.mockResolvedValue(
        createMockJob({ status: JobStatus.DRAFT, publishedAt: null }),
      );

      await service.create(
        {
          slug: 'draft-job',
          department: 'ENGINEERING',
          level: 'MID',
          type: 'FULL_TIME',
          location: 'Remote',
          status: 'DRAFT',
          translations: [
            {
              locale: 'en',
              title: 'Draft Job',
              description: 'Draft description',
              responsibilities: [],
              requirements: [],
            },
          ],
        },
        'user-1',
      );

      expect(mockPrismaService.job.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ publishedAt: null }),
        }),
      );
    });
  });

  describe('update — non-conflicting slug', () => {
    it('updates slug when the new slug is free', async () => {
      mockPrismaService.job.findUnique.mockResolvedValue(createMockJob());
      mockPrismaService.job.findFirst.mockResolvedValue(null);
      mockPrismaService.job.update.mockResolvedValue(createMockJob({ slug: 'free-slug' }));

      await service.update('job-1', { slug: 'free-slug' });

      expect(mockPrismaService.job.findFirst).toHaveBeenCalledWith({
        where: { slug: 'free-slug', NOT: { id: 'job-1' } },
      });
      expect(mockPrismaService.job.update).toHaveBeenCalled();
    });
  });

  describe('update — no translations', () => {
    it('skips translation work when translations is undefined', async () => {
      mockPrismaService.job.findUnique.mockResolvedValue(createMockJob());
      mockPrismaService.job.update.mockResolvedValue(createMockJob());

      await service.update('job-1', { location: 'Berlin' });

      expect(mockPrismaService.jobTranslation.upsert).not.toHaveBeenCalled();
      expect(mockPrismaService.jobTranslation.deleteMany).not.toHaveBeenCalled();
    });
  });

  describe('update — non-PUBLISHED status', () => {
    it('does not set publishedAt when status is not PUBLISHED', async () => {
      mockPrismaService.job.findUnique.mockResolvedValue(createMockJob());
      mockPrismaService.job.update.mockResolvedValue(
        createMockJob({ status: JobStatus.DRAFT }),
      );

      await service.update('job-1', { status: 'DRAFT' });

      const updateCall = mockPrismaService.job.update.mock.calls[0][0];
      expect(updateCall.data).not.toHaveProperty('publishedAt');
    });
  });

  describe('findAll', () => {
    it('returns only published jobs with translations', async () => {
      const jobs = [
        createMockJob(),
        createMockJob({ id: 'job-2', slug: 'backend', translations: [] }),
      ];
      mockPrismaService.job.findMany.mockResolvedValue(jobs);

      const result = await service.findAll();

      expect(mockPrismaService.job.findMany).toHaveBeenCalledWith({
        where: { status: JobStatus.PUBLISHED },
        include: { translations: true },
        orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
      });
      expect(result).toHaveLength(1);
      expect(result[0].slug).toBe('senior-frontend');
    });

    it('filters by department when provided', async () => {
      mockPrismaService.job.findMany.mockResolvedValue([]);

      await service.findAll({ department: 'DESIGN' });

      expect(mockPrismaService.job.findMany).toHaveBeenCalledWith({
        where: { status: JobStatus.PUBLISHED, department: 'DESIGN' },
        include: { translations: true },
        orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
      });
    });

    it('does not trigger portal revalidation', async () => {
      mockPrismaService.job.findMany.mockResolvedValue([]);

      await service.findAll();

      expect(mockPortalRevalidateService.scheduleRevalidate).not.toHaveBeenCalled();
    });
  });

  describe('findOneBySlug', () => {
    it('returns job when found and published', async () => {
      const job = createMockJob();
      mockPrismaService.job.findFirst.mockResolvedValue(job);

      const result = await service.findOneBySlug('senior-frontend');

      expect(mockPrismaService.job.findFirst).toHaveBeenCalledWith({
        where: { slug: 'senior-frontend', status: JobStatus.PUBLISHED },
        include: { translations: true },
      });
      expect(result).toEqual(job);
    });

    it('throws NotFoundException when job missing', async () => {
      mockPrismaService.job.findFirst.mockResolvedValue(null);

      await expect(service.findOneBySlug('missing')).rejects.toThrow(NotFoundException);
    });

    it('does not trigger portal revalidation', async () => {
      mockPrismaService.job.findFirst.mockResolvedValue(createMockJob());

      await service.findOneBySlug('senior-frontend');

      expect(mockPortalRevalidateService.scheduleRevalidate).not.toHaveBeenCalled();
    });
  });

  describe('findAllAdmin', () => {
    it('returns all jobs regardless of status', async () => {
      mockPrismaService.job.findMany.mockResolvedValue([]);

      await service.findAllAdmin();

      expect(mockPrismaService.job.findMany).toHaveBeenCalledWith({
        include: { translations: true },
        orderBy: { updatedAt: 'desc' },
      });
    });

    it('does not trigger portal revalidation', async () => {
      mockPrismaService.job.findMany.mockResolvedValue([]);

      await service.findAllAdmin();

      expect(mockPortalRevalidateService.scheduleRevalidate).not.toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('returns job by id', async () => {
      const job = createMockJob();
      mockPrismaService.job.findUnique.mockResolvedValue(job);

      const result = await service.findOne('job-1');

      expect(result).toEqual(job);
    });

    it('throws NotFoundException when job missing', async () => {
      mockPrismaService.job.findUnique.mockResolvedValue(null);

      await expect(service.findOne('missing')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    const createInput: TCreateJobInputData = {
      slug: 'new-job',
      department: 'ENGINEERING',
      level: 'MID',
      type: 'FULL_TIME',
      location: 'Remote',
      icon: 'cpu',
      status: 'PUBLISHED',
      translations: [
        {
          locale: 'en',
          title: 'New Job',
          description: 'Desc',
          responsibilities: [],
          requirements: [],
        },
      ],
    };

    it('creates job with all translations', async () => {
      mockPrismaService.job.findUnique.mockResolvedValue(null);
      mockPrismaService.job.create.mockResolvedValue(
        createMockJob({ slug: 'new-job' }),
      );

      const result = await service.create(createInput, 'user-1');

      expect(mockPrismaService.job.create).toHaveBeenCalledWith({
        data: {
          slug: 'new-job',
          department: 'ENGINEERING',
          level: 'MID',
          type: 'FULL_TIME',
          location: 'Remote',
          icon: 'cpu',
          status: 'PUBLISHED',
          publishedAt: expect.any(Date),
          authorId: 'user-1',
          translations: { create: createInput.translations },
        },
        include: { translations: true },
      });
      expect(result.slug).toBe('new-job');
    });

    it('triggers portal revalidation after successful create', async () => {
      mockPrismaService.job.findUnique.mockResolvedValue(null);
      mockPrismaService.job.create.mockResolvedValue(createMockJob());

      await service.create(createInput, 'user-1');

      expect(mockPortalRevalidateService.scheduleRevalidate).toHaveBeenCalledTimes(1);
      expect(mockPortalRevalidateService.scheduleRevalidate).toHaveBeenCalledWith(['jobs']);
    });

    it('throws ConflictException when slug is taken', async () => {
      mockPrismaService.job.findUnique.mockResolvedValue(createMockJob());

      await expect(service.create(createInput, 'user-1')).rejects.toThrow(
        ConflictException,
      );
    });

    it('does not trigger revalidation when create fails', async () => {
      mockPrismaService.job.findUnique.mockResolvedValue(createMockJob());

      await expect(service.create(createInput, 'user-1')).rejects.toThrow(
        ConflictException,
      );

      expect(mockPortalRevalidateService.scheduleRevalidate).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('updates root fields and handles translations atomically', async () => {
      mockPrismaService.job.findUnique.mockResolvedValue(createMockJob());

      const input: TUpdateJobInputData = {
        location: 'London',
        status: 'PUBLISHED',
        translations: [
          {
            locale: 'en',
            title: 'EN',
            description: 'Desc EN',
            responsibilities: [],
            requirements: [],
          },
          {
            locale: 'ua',
            title: 'UA',
            description: 'Desc UA',
            responsibilities: [],
            requirements: [],
          },
        ],
      };

      await service.update('job-1', input);

      expect(mockPrismaService.job.update).toHaveBeenCalledWith({
        where: { id: 'job-1' },
        data: {
          location: 'London',
          status: 'PUBLISHED',
          publishedAt: expect.any(Date),
        },
      });

      expect(mockPrismaService.jobTranslation.upsert).toHaveBeenCalledTimes(2);
      expect(mockPrismaService.jobTranslation.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { jobId_locale: { jobId: 'job-1', locale: 'en' } },
        }),
      );
      expect(mockPrismaService.jobTranslation.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { jobId_locale: { jobId: 'job-1', locale: 'ua' } },
        }),
      );

      expect(mockPrismaService.jobTranslation.deleteMany).toHaveBeenCalledWith({
        where: { jobId: 'job-1', locale: { notIn: ['en', 'ua'] } },
      });

      expect(mockPrismaService.job.findUnique).toHaveBeenLastCalledWith({
        where: { id: 'job-1' },
        include: { translations: true },
      });
    });

    it('deletes translations that are missing in the payload', async () => {
      mockPrismaService.job.findUnique.mockResolvedValue(createMockJob());

      const input: TUpdateJobInputData = {
        translations: [
          {
            locale: 'en',
            title: 'EN',
            description: 'Desc EN',
            responsibilities: [],
            requirements: [],
          },
        ],
      };

      await service.update('job-1', input);

      expect(mockPrismaService.jobTranslation.deleteMany).toHaveBeenCalledWith({
        where: { jobId: 'job-1', locale: { notIn: ['en'] } },
      });
    });

    it('triggers portal revalidation after successful update', async () => {
      mockPrismaService.job.findUnique.mockResolvedValue(createMockJob());

      await service.update('job-1', { location: 'Berlin' });

      expect(mockPortalRevalidateService.scheduleRevalidate).toHaveBeenCalledTimes(1);
      expect(mockPortalRevalidateService.scheduleRevalidate).toHaveBeenCalledWith(['jobs']);
    });

    it('throws ConflictException when new slug is taken', async () => {
      mockPrismaService.job.findUnique.mockResolvedValue(createMockJob());
      mockPrismaService.job.findFirst.mockResolvedValue(createMockJob({ id: 'other' }));

      await expect(service.update('job-1', { slug: 'taken' })).rejects.toThrow(
        ConflictException,
      );
    });

    it('throws NotFoundException when job missing', async () => {
      mockPrismaService.job.findUnique.mockResolvedValue(null);

      await expect(service.update('missing', { location: 'X' })).rejects.toThrow(
        NotFoundException,
      );
    });

    it('does not trigger revalidation when update fails', async () => {
      mockPrismaService.job.findUnique.mockResolvedValue(null);

      await expect(service.update('missing', { location: 'X' })).rejects.toThrow(
        NotFoundException,
      );

      expect(mockPortalRevalidateService.scheduleRevalidate).not.toHaveBeenCalled();
    });
  });

  describe('publish', () => {
    it('updates status and publishedAt', async () => {
      mockPrismaService.job.findUnique.mockResolvedValue(createMockJob());

      await service.publish('job-1');

      expect(mockPrismaService.job.update).toHaveBeenCalledWith({
        where: { id: 'job-1' },
        data: { status: JobStatus.PUBLISHED, publishedAt: expect.any(Date) },
        include: { translations: true },
      });
    });

    it('triggers portal revalidation after successful publish', async () => {
      mockPrismaService.job.findUnique.mockResolvedValue(createMockJob());

      await service.publish('job-1');

      expect(mockPortalRevalidateService.scheduleRevalidate).toHaveBeenCalledWith([
        'jobs',
      ]);
    });

    it('does not trigger revalidation when job is missing', async () => {
      mockPrismaService.job.findUnique.mockResolvedValue(null);

      await expect(service.publish('missing')).rejects.toThrow(NotFoundException);
      expect(mockPortalRevalidateService.scheduleRevalidate).not.toHaveBeenCalled();
    });
  });

  describe('archive', () => {
    it('updates status to ARCHIVED', async () => {
      mockPrismaService.job.findUnique.mockResolvedValue(createMockJob());

      await service.archive('job-1');

      expect(mockPrismaService.job.update).toHaveBeenCalledWith({
        where: { id: 'job-1' },
        data: { status: JobStatus.ARCHIVED },
        include: { translations: true },
      });
    });

    it('triggers portal revalidation after successful archive', async () => {
      mockPrismaService.job.findUnique.mockResolvedValue(createMockJob());

      await service.archive('job-1');

      expect(mockPortalRevalidateService.scheduleRevalidate).toHaveBeenCalledWith([
        'jobs',
      ]);
    });
  });

  describe('remove', () => {
    it('deletes the job', async () => {
      mockPrismaService.job.findUnique.mockResolvedValue(createMockJob());

      await service.remove('job-1');

      expect(mockPrismaService.job.delete).toHaveBeenCalledWith({
        where: { id: 'job-1' },
      });
    });

    it('triggers portal revalidation after successful remove', async () => {
      mockPrismaService.job.findUnique.mockResolvedValue(createMockJob());

      await service.remove('job-1');

      expect(mockPortalRevalidateService.scheduleRevalidate).toHaveBeenCalledWith([
        'jobs',
      ]);
    });
  });

  describe('upsertTranslation', () => {
    const input: TUpsertJobTranslationInputData = {
      locale: 'ua',
      title: 'UA title',
      description: 'UA description',
      responsibilities: [],
      requirements: [],
    };

    it('upserts translation when job exists', async () => {
      mockPrismaService.job.findUnique.mockResolvedValue(createMockJob());
      mockPrismaService.jobTranslation.upsert.mockResolvedValue({ id: 'tr-ua' });

      await service.upsertTranslation('job-1', input);

      expect(mockPrismaService.job.findUnique).toHaveBeenCalledWith({
        where: { id: 'job-1' },
        include: { translations: true },
      });
      expect(mockPrismaService.jobTranslation.upsert).toHaveBeenCalledWith({
        where: { jobId_locale: { jobId: 'job-1', locale: 'ua' } },
        create: { jobId: 'job-1', ...input },
        update: {
          title: input.title,
          description: input.description,
          responsibilities: input.responsibilities,
          requirements: input.requirements,
          metaTitle: input.metaTitle,
          metaDescription: input.metaDescription,
        },
      });
    });

    it('triggers portal revalidation after successful upsert', async () => {
      mockPrismaService.job.findUnique.mockResolvedValue(createMockJob());
      mockPrismaService.jobTranslation.upsert.mockResolvedValue({ id: 'tr-ua' });

      await service.upsertTranslation('job-1', input);

      expect(mockPortalRevalidateService.scheduleRevalidate).toHaveBeenCalledWith([
        'jobs',
      ]);
    });

    it('throws NotFoundException when job is missing', async () => {
      mockPrismaService.job.findUnique.mockResolvedValue(null);

      await expect(service.upsertTranslation('missing', input)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockPrismaService.jobTranslation.upsert).not.toHaveBeenCalled();
      expect(mockPortalRevalidateService.scheduleRevalidate).not.toHaveBeenCalled();
    });
  });

  describe('removeTranslation', () => {
    it('deletes translation when found', async () => {
      mockPrismaService.jobTranslation.findUnique.mockResolvedValue({ id: 'tr-1' });
      mockPrismaService.jobTranslation.delete.mockResolvedValue({ id: 'tr-1' });

      await service.removeTranslation('job-1', 'en');

      expect(mockPrismaService.jobTranslation.findUnique).toHaveBeenCalledWith({
        where: { jobId_locale: { jobId: 'job-1', locale: 'en' } },
      });
      expect(mockPrismaService.jobTranslation.delete).toHaveBeenCalledWith({
        where: { jobId_locale: { jobId: 'job-1', locale: 'en' } },
      });
    });

    it('triggers portal revalidation after successful removeTranslation', async () => {
      mockPrismaService.jobTranslation.findUnique.mockResolvedValue({ id: 'tr-1' });
      mockPrismaService.jobTranslation.delete.mockResolvedValue({ id: 'tr-1' });

      await service.removeTranslation('job-1', 'en');

      expect(mockPortalRevalidateService.scheduleRevalidate).toHaveBeenCalledWith([
        'jobs',
      ]);
    });

    it('throws NotFoundException when translation is missing', async () => {
      mockPrismaService.jobTranslation.findUnique.mockResolvedValue(null);

      await expect(service.removeTranslation('job-1', 'xx')).rejects.toThrow(
        NotFoundException,
      );
      expect(mockPrismaService.jobTranslation.delete).not.toHaveBeenCalled();
      expect(mockPortalRevalidateService.scheduleRevalidate).not.toHaveBeenCalled();
    });
  });

  describe('incrementViews', () => {
    it('increments the views counter for the given job', async () => {
      mockPrismaService.job.update.mockResolvedValue({ id: 'job-1', views: 1 });

      await service.incrementViews('job-1');

      expect(mockPrismaService.job.update).toHaveBeenCalledWith({
        where: { id: 'job-1' },
        data: { views: { increment: 1 } },
      });
    });

    it('does not trigger portal revalidation', async () => {
      mockPrismaService.job.update.mockResolvedValue({ id: 'job-1', views: 1 });

      await service.incrementViews('job-1');

      expect(mockPortalRevalidateService.scheduleRevalidate).not.toHaveBeenCalled();
    });
  });

  describe('incrementApplications', () => {
    it('increments the applications counter for the given job', async () => {
      mockPrismaService.job.update.mockResolvedValue({ id: 'job-1', applications: 1 });

      await service.incrementApplications('job-1');

      expect(mockPrismaService.job.update).toHaveBeenCalledWith({
        where: { id: 'job-1' },
        data: { applications: { increment: 1 } },
      });
    });

    it('does not trigger portal revalidation', async () => {
      mockPrismaService.job.update.mockResolvedValue({ id: 'job-1', applications: 1 });

      await service.incrementApplications('job-1');

      expect(mockPortalRevalidateService.scheduleRevalidate).not.toHaveBeenCalled();
    });
  });
});