import { createApplicationsRouter } from '../applications.router';
import type { ApplicationsService } from '../applications.service';
import type { TrpcContext } from '@/trpc/context';

describe('Applications Router', () => {
  let mockApplicationsService: jest.Mocked<ApplicationsService>;
  let router: ReturnType<typeof createApplicationsRouter>;

  const mockListResult = [{ id: 'app_1' }, { id: 'app_2' }];
  const mockSingleResult = { id: 'app_1', name: 'John Doe' };

  type TMockUser = NonNullable<TrpcContext['user']>;

  const mockUser = { id: 'user_1', role: 'USER' } as unknown as TMockUser;
  const mockContentManager = { id: 'user_2', role: 'CONTENT_MANAGER' } as unknown as TMockUser;
  const mockSuperAdmin = { id: 'user_3', role: 'SUPER_ADMIN' } as unknown as TMockUser;

  const createMockContext = (user: TMockUser | null): TrpcContext => ({
    user,
    req: {} as TrpcContext['req'],
    res: {} as TrpcContext['res'],
  });

  beforeEach(() => {
    mockApplicationsService = {
      findAll: jest.fn().mockResolvedValue(mockListResult),
      findOne: jest.fn().mockResolvedValue(mockSingleResult),
      remove: jest.fn().mockResolvedValue(mockSingleResult),
      create: jest.fn(),
    } as unknown as jest.Mocked<ApplicationsService>;

    router = createApplicationsRouter(mockApplicationsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Access Control (contentManagerProcedure)', () => {
    it('should throw UNAUTHORIZED if user is not logged in', async () => {
      const caller = router.createCaller(createMockContext(null));

      await expect(caller.list({})).rejects.toMatchObject({
        code: 'UNAUTHORIZED',
      });
    });

    it('should throw FORBIDDEN if user is a regular USER', async () => {
      const caller = router.createCaller(createMockContext(mockUser));

      await expect(caller.list({})).rejects.toMatchObject({
        code: 'FORBIDDEN',
      });
    });
  });

  describe('list query', () => {
    it('should allow access for CONTENT_MANAGER and return applications', async () => {
      const caller = router.createCaller(createMockContext(mockContentManager));

      const result = await caller.list({ jobId: 'job_123' });

      expect(mockApplicationsService.findAll).toHaveBeenCalledWith({ jobId: 'job_123' });
      expect(result).toEqual(mockListResult);
    });

    it('should allow access for SUPER_ADMIN', async () => {
      const caller = router.createCaller(createMockContext(mockSuperAdmin));

      const result = await caller.list(undefined);

      expect(mockApplicationsService.findAll).toHaveBeenCalledWith(undefined);
      expect(result).toEqual(mockListResult);
    });
  });

  describe('byId query', () => {
    it('should call findAll with id and return application', async () => {
      const caller = router.createCaller(createMockContext(mockContentManager));

      const result = await caller.byId({ id: 'app_1' });

      expect(mockApplicationsService.findOne).toHaveBeenCalledWith('app_1');
      expect(result).toEqual(mockSingleResult);
    });
  });

  describe('remove mutation', () => {
    it('should call remove with id and return deleted application', async () => {
      const caller = router.createCaller(createMockContext(mockContentManager));

      const result = await caller.remove({ id: 'app_1' });

      expect(mockApplicationsService.remove).toHaveBeenCalledWith('app_1');
      expect(result).toEqual(mockSingleResult);
    });
  });
});
