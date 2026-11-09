import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { JobStatus } from '@prisma/client';
import { JobsService } from '../jobs.service';
import { PrismaService } from '@/prisma/prisma.service';
import type { TCreateJobInputData, TUpdateJobInputData } from '@pipeline/contracts';

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
  },
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
      ],
    }).compile();

    service = module.get<JobsService>(JobsService);
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

    it('includes unpublished when includeUnpublished = true', async () => {
      mockPrismaService.job.findMany.mockResolvedValue([]);

      await service.findAll({ includeUnpublished: true });

      expect(mockPrismaService.job.findMany).toHaveBeenCalledWith({
        where: {},
        include: { translations: true },
        orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
      });
    });

    it('ignores locale option (returns all translations)', async () => {
      const jobs = [
        createMockJob({
          translations: [
            {
              id: 'tr-1',
              jobId: 'job-1',
              locale: 'en',
              title: 'EN',
              description: '',
              responsibilities: [],
              requirements: [],
              metaTitle: null,
              metaDescription: null,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              id: 'tr-2',
              jobId: 'job-1',
              locale: 'ua',
              title: 'UA',
              description: '',
              responsibilities: [],
              requirements: [],
              metaTitle: null,
              metaDescription: null,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
        }),
      ];
      mockPrismaService.job.findMany.mockResolvedValue(jobs);

      const result = await service.findAll({ locale: 'ua' });

      expect(mockPrismaService.job.findMany).toHaveBeenCalledWith({
        where: { status: JobStatus.PUBLISHED },
        include: { translations: true },
        orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
      });
      expect(result[0].translations).toHaveLength(2);
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

    it('throws NotFoundException when job has no translations', async () => {
      mockPrismaService.job.findFirst.mockResolvedValue(
        createMockJob({ translations: [] }),
      );

      await expect(service.findOneBySlug('senior-frontend')).rejects.toThrow(
        NotFoundException,
      );
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
      mockPrismaService.job.create.mockResolvedValue(createMockJob({ slug: 'new-job' }));

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

    it('sets publishedAt = null when status is DRAFT', async () => {
      mockPrismaService.job.findUnique.mockResolvedValue(null);
      mockPrismaService.job.create.mockResolvedValue(createMockJob({ status: 'DRAFT' }));

      await service.create({ ...createInput, status: 'DRAFT' }, 'user-1');

      expect(mockPrismaService.job.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            status: 'DRAFT',
            publishedAt: null,
          }),
        }),
      );
    });

    it('throws ConflictException when slug is taken', async () => {
      mockPrismaService.job.findUnique.mockResolvedValue(createMockJob());

      await expect(service.create(createInput, 'user-1')).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('update', () => {
    it('updates only provided fields', async () => {
      mockPrismaService.job.findUnique.mockResolvedValue(createMockJob());
      mockPrismaService.job.update.mockResolvedValue(createMockJob({ location: 'London' }));

      const input: TUpdateJobInputData = { location: 'London' };
      const result = await service.update('job-1', input);

      expect(mockPrismaService.job.update).toHaveBeenCalledWith({
        where: { id: 'job-1' },
        data: { location: 'London' },
        include: { translations: true },
      });
      expect(result.location).toBe('London');
    });

    it('sets publishedAt when status becomes PUBLISHED', async () => {
      mockPrismaService.job.findUnique.mockResolvedValue(createMockJob({ status: 'DRAFT' }));
      mockPrismaService.job.update.mockResolvedValue(createMockJob());

      await service.update('job-1', { status: 'PUBLISHED' });

      expect(mockPrismaService.job.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            status: 'PUBLISHED',
            publishedAt: expect.any(Date),
          }),
        }),
      );
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
  });

  describe('publish', () => {
    it('updates status and publishedAt', async () => {
      mockPrismaService.job.findUnique.mockResolvedValue(createMockJob());
      mockPrismaService.job.update.mockResolvedValue(createMockJob());

      await service.publish('job-1');

      expect(mockPrismaService.job.update).toHaveBeenCalledWith({
        where: { id: 'job-1' },
        data: { status: JobStatus.PUBLISHED, publishedAt: expect.any(Date) },
        include: { translations: true },
      });
    });
  });

  describe('archive', () => {
    it('updates status to ARCHIVED', async () => {
      mockPrismaService.job.findUnique.mockResolvedValue(createMockJob());
      mockPrismaService.job.update.mockResolvedValue(createMockJob({ status: 'ARCHIVED' }));

      await service.archive('job-1');

      expect(mockPrismaService.job.update).toHaveBeenCalledWith({
        where: { id: 'job-1' },
        data: { status: JobStatus.ARCHIVED },
        include: { translations: true },
      });
    });
  });

  describe('remove', () => {
    it('deletes the job', async () => {
      mockPrismaService.job.findUnique.mockResolvedValue(createMockJob());
      mockPrismaService.job.delete.mockResolvedValue(createMockJob());

      await service.remove('job-1');

      expect(mockPrismaService.job.delete).toHaveBeenCalledWith({
        where: { id: 'job-1' },
      });
    });

    it('throws NotFoundException when job missing', async () => {
      mockPrismaService.job.findUnique.mockResolvedValue(null);

      await expect(service.remove('missing')).rejects.toThrow(NotFoundException);
    });
  });

  describe('upsertTranslation', () => {
    const data = {
      locale: 'ua',
      title: 'Заголовок',
      description: 'Опис',
      responsibilities: ['a'],
      requirements: ['b'],
      metaTitle: 'SEO',
      metaDescription: 'SEO desc',
    };

    it('upserts translation', async () => {
      mockPrismaService.job.findUnique.mockResolvedValue(createMockJob());
      mockPrismaService.jobTranslation.upsert.mockResolvedValue({ ...data, id: 'tr-ua' });

      await service.upsertTranslation('job-1', data);

      expect(mockPrismaService.jobTranslation.upsert).toHaveBeenCalledWith({
        where: { jobId_locale: { jobId: 'job-1', locale: 'ua' } },
        create: { jobId: 'job-1', ...data },
        update: {
          title: data.title,
          description: data.description,
          responsibilities: data.responsibilities,
          requirements: data.requirements,
          metaTitle: data.metaTitle,
          metaDescription: data.metaDescription,
        },
      });
    });

    it('throws NotFoundException when job missing', async () => {
      mockPrismaService.job.findUnique.mockResolvedValue(null);

      await expect(service.upsertTranslation('missing', data)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('removeTranslation', () => {
    it('deletes translation', async () => {
      mockPrismaService.jobTranslation.findUnique.mockResolvedValue({ id: 'tr-ua' });
      mockPrismaService.jobTranslation.delete.mockResolvedValue({});

      await service.removeTranslation('job-1', 'ua');

      expect(mockPrismaService.jobTranslation.delete).toHaveBeenCalledWith({
        where: { jobId_locale: { jobId: 'job-1', locale: 'ua' } },
      });
    });

    it('throws NotFoundException when translation missing', async () => {
      mockPrismaService.jobTranslation.findUnique.mockResolvedValue(null);

      await expect(service.removeTranslation('job-1', 'ua')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});