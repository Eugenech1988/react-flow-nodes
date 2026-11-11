import {
  router,
  protectedProcedure,
  contentManagerProcedure,
  superAdminProcedure,
} from '@/trpc/init';
import type { TrpcContext } from '@/trpc/context';

type TMockUser = NonNullable<TrpcContext['user']>;

const createTestRouter = () =>
  router({
    protectedOnly: protectedProcedure.query(() => 'ok'),
    contentOnly: contentManagerProcedure.query(() => 'ok'),
    superAdminOnly: superAdminProcedure.query(() => 'ok'),
  });

const createMockContext = (role: string | null = null): TrpcContext => ({
  user: role === null ? null : ({ id: 'user_1', email: 'u@e.com', role } as TMockUser),
  req: {} as TrpcContext['req'],
  res: {} as TrpcContext['res'],
});

describe('trpc init', () => {
  let testRouter: ReturnType<typeof createTestRouter>;

  beforeEach(() => {
    testRouter = createTestRouter();
  });

  describe('protectedProcedure', () => {
    it('passes with user', async () => {
      const caller = testRouter.createCaller(createMockContext('USER'));
      await expect(caller.protectedOnly()).resolves.toBe('ok');
    });

    it('rejects without user', async () => {
      const caller = testRouter.createCaller(createMockContext(null));
      await expect(caller.protectedOnly()).rejects.toMatchObject({ code: 'UNAUTHORIZED' });
    });
  });

  describe('contentManagerProcedure', () => {
    it('passes for CONTENT_MANAGER', async () => {
      const caller = testRouter.createCaller(createMockContext('CONTENT_MANAGER'));
      await expect(caller.contentOnly()).resolves.toBe('ok');
    });

    it('passes for SUPER_ADMIN', async () => {
      const caller = testRouter.createCaller(createMockContext('SUPER_ADMIN'));
      await expect(caller.contentOnly()).resolves.toBe('ok');
    });

    it('rejects for USER', async () => {
      const caller = testRouter.createCaller(createMockContext('USER'));
      await expect(caller.contentOnly()).rejects.toMatchObject({ code: 'FORBIDDEN' });
    });
  });

  describe('superAdminProcedure', () => {
    it('passes for SUPER_ADMIN', async () => {
      const caller = testRouter.createCaller(createMockContext('SUPER_ADMIN'));
      await expect(caller.superAdminOnly()).resolves.toBe('ok');
    });

    it('rejects for USER', async () => {
      const caller = testRouter.createCaller(createMockContext('USER'));
      await expect(caller.superAdminOnly()).rejects.toMatchObject({ code: 'FORBIDDEN' });
    });

    it('rejects for CONTENT_MANAGER', async () => {
      const caller = testRouter.createCaller(createMockContext('CONTENT_MANAGER'));
      await expect(caller.superAdminOnly()).rejects.toMatchObject({ code: 'FORBIDDEN' });
    });
  });
});
