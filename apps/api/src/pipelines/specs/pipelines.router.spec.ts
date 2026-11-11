import { createPipelinesRouter } from '../pipelines.router';
import type { PipelinesService } from '../pipelines.service';
import type { TrpcContext } from '@/trpc/context';

type TMockUser = NonNullable<TrpcContext['user']>;
type TListed = Awaited<ReturnType<PipelinesService['findAllByUserId']>>;
type TUpdated = Awaited<ReturnType<PipelinesService['update']>>;
type TRemoved = Awaited<ReturnType<PipelinesService['remove']>>;
type TMockPipelinesService = jest.Mocked<
  Pick<PipelinesService, 'create' | 'findAllByUserId' | 'update' | 'remove'>
>;

const createMockPipelinesService = (): TMockPipelinesService => ({
  create: jest.fn(),
  findAllByUserId: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
});

describe('Pipelines Router', () => {
  let mockPipelinesService: TMockPipelinesService;
  let router: ReturnType<typeof createPipelinesRouter>;

  const mockUser = {
    id: 'user_1',
    email: 'test@example.com',
    role: 'USER',
  } as TMockUser;

  const createMockContext = (user: TMockUser | null = mockUser): TrpcContext => ({
    user,
    req: {} as TrpcContext['req'],
    res: {} as TrpcContext['res'],
  });

  beforeEach(() => {
    mockPipelinesService = createMockPipelinesService();
    router = createPipelinesRouter(mockPipelinesService as unknown as PipelinesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('list', () => {
    it('forwards ctx.user.id to findAllByUserId', async () => {
      const pipelines = [{ id: 'p1' }] as TListed;
      mockPipelinesService.findAllByUserId.mockResolvedValue(pipelines);

      const caller = router.createCaller(createMockContext());
      const out = await caller.list();

      expect(mockPipelinesService.findAllByUserId).toHaveBeenCalledWith('user_1');
      expect(out).toEqual(pipelines);
    });

    it('rejects unauthenticated callers', async () => {
      const caller = router.createCaller(createMockContext(null));
      await expect(caller.list()).rejects.toMatchObject({ code: 'UNAUTHORIZED' });
    });
  });

  describe('remove', () => {
    it('forwards id and ctx.user.id to remove', async () => {
      const removed = { id: 'pipe_1' } as TRemoved;
      mockPipelinesService.remove.mockResolvedValue(removed);

      const caller = router.createCaller(createMockContext());
      const out = await caller.remove({ id: 'pipe_1' });

      expect(mockPipelinesService.remove).toHaveBeenCalledWith('pipe_1', 'user_1');
      expect(out).toEqual(removed);
    });

    it('rejects unauthenticated callers', async () => {
      const caller = router.createCaller(createMockContext(null));
      await expect(caller.remove({ id: 'pipe_1' })).rejects.toMatchObject({
        code: 'UNAUTHORIZED',
      });
    });
  });

  describe('update', () => {
    it('strips id and forwards dto with ctx.user.id', async () => {
      const updated = { id: 'pipe_1', name: 'New' } as TUpdated;
      mockPipelinesService.update.mockResolvedValue(updated);

      const caller = router.createCaller(createMockContext());
      const out = await caller.update({ id: 'pipe_1', name: 'New', description: 'D' });

      expect(mockPipelinesService.update).toHaveBeenCalledWith('pipe_1', 'user_1', {
        name: 'New',
        description: 'D',
      });
      expect(out).toEqual(updated);
    });

    it('rejects unauthenticated callers', async () => {
      const caller = router.createCaller(createMockContext(null));
      await expect(caller.update({ id: 'pipe_1', name: 'New' })).rejects.toMatchObject({
        code: 'UNAUTHORIZED',
      });
    });
  });
});
