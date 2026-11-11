import { createJobsRouter } from '../jobs.router';
import type { JobsService } from '../jobs.service';
import type { TrpcContext } from '@/trpc/context';

describe('Jobs Router', () => {
  let mockJobsService: jest.Mocked<JobsService>;
  let router: ReturnType<typeof createJobsRouter>;

  type TMockUser = NonNullable<TrpcContext['user']>;

  const mockUser = {
    id: 'user-1',
    email: 'admin@example.com',
    role: 'CONTENT_MANAGER',
  } as unknown as TMockUser;

  const createMockContext = (user: TMockUser | null = mockUser): TrpcContext => ({
    user,
    req: {} as unknown as TrpcContext['req'],
    res: {} as unknown as TrpcContext['res'],
  });

  beforeEach(() => {
    mockJobsService = {
      findAll: jest.fn(),
      findOneBySlug: jest.fn(),
      findAllAdmin: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      publish: jest.fn(),
      archive: jest.fn(),
      remove: jest.fn(),
      upsertTranslation: jest.fn(),
      removeTranslation: jest.fn(),
      incrementViews: jest.fn(),
      incrementApplications: jest.fn(),
    } as unknown as jest.Mocked<JobsService>;

    router = createJobsRouter(mockJobsService);
  });

  describe('list', () => {
    it('forwards filters to service.findAll', async () => {
      mockJobsService.findAll.mockResolvedValue([]);
      const caller = router.createCaller(createMockContext(null));
      await caller.list({ locale: 'ua', department: 'ENGINEERING' });
      expect(mockJobsService.findAll).toHaveBeenCalledWith({
        locale: 'ua',
        department: 'ENGINEERING',
      });
    });

    it('forwards undefined when input is omitted', async () => {
      mockJobsService.findAll.mockResolvedValue([]);
      const caller = router.createCaller(createMockContext(null));
      await caller.list();
      expect(mockJobsService.findAll).toHaveBeenCalledWith(undefined);
    });
  });

  it('injects ctx.user.id into service.create', async () => {
    const input = {
      slug: 'new-job',
      department: 'ENGINEERING' as const,
      level: 'MID' as const,
      type: 'FULL_TIME' as const,
      location: 'Remote',
      status: 'PUBLISHED' as const,
      translations: [
        {
          locale: 'en',
          title: 'New Job',
          description: 'Job description',
          responsibilities: [],
          requirements: [],
        },
      ],
    };
    mockJobsService.create.mockResolvedValue({ id: 'job-2' } as never);

    const caller = router.createCaller(createMockContext());
    await caller.create(input);

    expect(mockJobsService.create).toHaveBeenCalledWith(input, 'user-1');
  });

  describe('bySlug', () => {
    it('forwards slug and locale', async () => {
      mockJobsService.findOneBySlug.mockResolvedValue({ id: 'job-1' } as never);
      const caller = router.createCaller(createMockContext(null));
      await caller.bySlug({ slug: 'senior', locale: 'ua' });
      expect(mockJobsService.findOneBySlug).toHaveBeenCalledWith('senior', 'ua');
    });
  });

  describe('adminList', () => {
    it('calls service.findAllAdmin', async () => {
      mockJobsService.findAllAdmin.mockResolvedValue([]);
      const caller = router.createCaller(createMockContext());
      await caller.adminList();
      expect(mockJobsService.findAllAdmin).toHaveBeenCalled();
    });

    it('rejects unauthenticated callers', async () => {
      const caller = router.createCaller(createMockContext(null));
      await expect(caller.adminList()).rejects.toMatchObject({ code: 'UNAUTHORIZED' });
    });
  });

  describe('adminById', () => {
    it('forwards id to service.findOne', async () => {
      mockJobsService.findOne.mockResolvedValue({ id: 'job-1' } as never);
      const caller = router.createCaller(createMockContext());
      await caller.adminById({ id: 'job-1' });
      expect(mockJobsService.findOne).toHaveBeenCalledWith('job-1');
    });
  });

  describe('create', () => {
    it('injects ctx.user.id into service.create', async () => {
      const input = {
        slug: 'new-job',
        department: 'ENGINEERING' as const,
        level: 'MID' as const,
        type: 'FULL_TIME' as const,
        location: 'Remote',
        status: 'PUBLISHED' as const,
        translations: [
          {
            locale: 'en',
            title: 'New Job', // ≥ 2 chars
            description: 'Job description', // ≥ 10 chars
            responsibilities: [],
            requirements: [],
          },
        ],
      };
      mockJobsService.create.mockResolvedValue({ id: 'job-2' } as never);

      const caller = router.createCaller(createMockContext());
      await caller.create(input);

      expect(mockJobsService.create).toHaveBeenCalledWith(input, 'user-1');
    });
  });

  describe('update', () => {
    it('forwards id and data', async () => {
      mockJobsService.update.mockResolvedValue({ id: 'job-1' } as never);
      const caller = router.createCaller(createMockContext());
      await caller.update({ id: 'job-1', data: { location: 'London' } });
      expect(mockJobsService.update).toHaveBeenCalledWith('job-1', { location: 'London' });
    });
  });

  describe('publish', () => {
    it('forwards id', async () => {
      mockJobsService.publish.mockResolvedValue({ id: 'job-1' } as never);
      const caller = router.createCaller(createMockContext());
      await caller.publish({ id: 'job-1' });
      expect(mockJobsService.publish).toHaveBeenCalledWith('job-1');
    });
  });

  describe('archive', () => {
    it('forwards id', async () => {
      mockJobsService.archive.mockResolvedValue({ id: 'job-1' } as never);
      const caller = router.createCaller(createMockContext());
      await caller.archive({ id: 'job-1' });
      expect(mockJobsService.archive).toHaveBeenCalledWith('job-1');
    });
  });

  describe('remove', () => {
    it('forwards id', async () => {
      mockJobsService.remove.mockResolvedValue({ id: 'job-1' } as never);
      const caller = router.createCaller(createMockContext());
      await caller.remove({ id: 'job-1' });
      expect(mockJobsService.remove).toHaveBeenCalledWith('job-1');
    });
  });

  describe('upsertTranslation', () => {
    it('forwards jobId and data', async () => {
      const data = {
        locale: 'ua',
        title: 'UA title',
        description: 'UA description',
        responsibilities: [],
        requirements: [],
      };
      mockJobsService.upsertTranslation.mockResolvedValue({ id: 'tr-ua' } as never);

      const caller = router.createCaller(createMockContext());
      await caller.upsertTranslation({ jobId: 'job-1', data });

      expect(mockJobsService.upsertTranslation).toHaveBeenCalledWith('job-1', data);
    });
  });

  describe('removeTranslation', () => {
    it('forwards jobId and locale', async () => {
      mockJobsService.removeTranslation.mockResolvedValue({} as never);
      const caller = router.createCaller(createMockContext());
      await caller.removeTranslation({ jobId: 'job-1', locale: 'ua' });
      expect(mockJobsService.removeTranslation).toHaveBeenCalledWith('job-1', 'ua');
    });
  });

  describe('incrementViews', () => {
    it('calls service.incrementViews', async () => {
      mockJobsService.incrementViews.mockResolvedValue({} as never);
      const caller = router.createCaller(createMockContext(null));
      await caller.incrementViews({ id: 'job-1' });
      expect(mockJobsService.incrementViews).toHaveBeenCalledWith('job-1');
    });
  });

  describe('incrementApplications', () => {
    it('calls service.incrementApplications', async () => {
      mockJobsService.incrementApplications.mockResolvedValue({} as never);
      const caller = router.createCaller(createMockContext(null));
      await caller.incrementApplications({ id: 'job-1' });
      expect(mockJobsService.incrementApplications).toHaveBeenCalledWith('job-1');
    });
  });
});
