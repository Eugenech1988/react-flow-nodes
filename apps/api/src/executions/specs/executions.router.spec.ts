import { createExecutionsRouter } from '../executions.router';
import type { ExecutionsService } from '../executions.service';
import type { TrpcContext } from '@/trpc/context';

describe('Executions Router', () => {
  let mockExecutionsService: jest.Mocked<ExecutionsService>;
  let router: ReturnType<typeof createExecutionsRouter>;

  type TMockUser = NonNullable<TrpcContext['user']>;

  const mockUser = {
    id: 'user_123',
    email: 'test@example.com',
    role: 'USER',
  } as unknown as TMockUser;

  const createMockContext = (user: TMockUser | null = mockUser): TrpcContext => ({
    user,
    req: {} as unknown as TrpcContext['req'],
    res: {} as unknown as TrpcContext['res'],
  });

  beforeEach(() => {
    mockExecutionsService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    } as unknown as jest.Mocked<ExecutionsService>;

    router = createExecutionsRouter(mockExecutionsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should inject ctx.user.id and call service.create', async () => {
      const input = {
        pipelineId: 'pipe_123',
        userId: 'placeholder_from_client',
        status: 'RUNNING' as const,
        triggeredBy: 'MANUAL' as const,
        nodesExecuted: 0,
      };
      const result = { id: 'exec_123' };
      mockExecutionsService.create.mockResolvedValue(result as never);

      const caller = router.createCaller(createMockContext());
      const out = await caller.create(input);

      expect(mockExecutionsService.create).toHaveBeenCalledWith({
        ...input,
        userId: 'user_123', // ctx.user.id wins over input.userId
      });
      expect(out).toEqual(result);
    });

    it('should reject unauthenticated callers', async () => {
      const caller = router.createCaller(createMockContext(null));

      await expect(
        caller.create({
          pipelineId: 'pipe_123',
          userId: 'placeholder_from_client',
          status: 'RUNNING',
          triggeredBy: 'MANUAL',
          nodesExecuted: 0,
        }),
      ).rejects.toMatchObject({ code: 'UNAUTHORIZED' });
    });
  });

  describe('list', () => {
    it('should pass filters and ctx.user.id to service.findAll', async () => {
      const result = { items: [], total: 0, page: 1, limit: 10, totalPages: 0 };
      mockExecutionsService.findAll.mockResolvedValue(result);

      const caller = router.createCaller(createMockContext());
      const out = await caller.list({
        pipelineId: 'pipe_123',
        page: 2,
        limit: 5,
        search: 'deploy',
        status: 'success',
      });

      expect(mockExecutionsService.findAll).toHaveBeenCalledWith({
        userId: 'user_123',
        pipelineId: 'pipe_123',
        page: 2,
        limit: 5,
        search: 'deploy',
        status: 'success',
      });
      expect(out).toEqual(result);
    });

    it('should forward undefined filters when input is omitted', async () => {
      mockExecutionsService.findAll.mockResolvedValue({
        items: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      });

      const caller = router.createCaller(createMockContext());
      await caller.list();

      expect(mockExecutionsService.findAll).toHaveBeenCalledWith({
        userId: 'user_123',
        pipelineId: undefined,
        page: undefined,
        limit: undefined,
        search: undefined,
        status: undefined,
      });
    });

    it('should reject unauthenticated callers', async () => {
      const caller = router.createCaller(createMockContext(null));
      await expect(caller.list()).rejects.toMatchObject({ code: 'UNAUTHORIZED' });
    });
  });

  describe('getById', () => {
    it('should forward the id to service.findOne', async () => {
      mockExecutionsService.findOne.mockResolvedValue({ id: 'exec_123' } as never);

      const caller = router.createCaller(createMockContext());
      const out = await caller.getById({ id: 'exec_123' });

      expect(mockExecutionsService.findOne).toHaveBeenCalledWith('exec_123');
      expect(out.id).toBe('exec_123');
    });
  });

  describe('update', () => {
    it('should forward id and data to service.update', async () => {
      const data = { status: 'SUCCESS' } as const;
      mockExecutionsService.update.mockResolvedValue({
        id: 'exec_123',
        status: 'SUCCESS',
      } as never);

      const caller = router.createCaller(createMockContext());
      const out = await caller.update({ id: 'exec_123', data });

      expect(mockExecutionsService.update).toHaveBeenCalledWith('exec_123', data);
      expect(out.status).toBe('SUCCESS');
    });
  });

  describe('remove', () => {
    it('should forward the id to service.remove', async () => {
      mockExecutionsService.remove.mockResolvedValue({ id: 'exec_123' } as never);

      const caller = router.createCaller(createMockContext());
      await caller.remove({ id: 'exec_123' });

      expect(mockExecutionsService.remove).toHaveBeenCalledWith('exec_123');
    });
  });
});
