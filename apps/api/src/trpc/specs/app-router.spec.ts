jest.mock('@/auth/auth.router', () => {
  const { router } = jest.requireActual<typeof import('@/trpc/init')>('@/trpc/init');
  return { createAuthRouter: jest.fn(() => router({})) };
});
jest.mock('@/users/users.router', () => {
  const { router } = jest.requireActual<typeof import('@/trpc/init')>('@/trpc/init');
  return { createUsersRouter: jest.fn(() => router({})) };
});
jest.mock('@/billing/billing.router', () => {
  const { router } = jest.requireActual<typeof import('@/trpc/init')>('@/trpc/init');
  return { createBillingRouter: jest.fn(() => router({})) };
});
jest.mock('@/pipelines/pipelines.router', () => {
  const { router } = jest.requireActual<typeof import('@/trpc/init')>('@/trpc/init');
  return { createPipelinesRouter: jest.fn(() => router({})) };
});
jest.mock('@/executions/executions.router', () => {
  const { router } = jest.requireActual<typeof import('@/trpc/init')>('@/trpc/init');
  return { createExecutionsRouter: jest.fn(() => router({})) };
});
jest.mock('@/database-nodes/database-nodes.router', () => {
  const { router } = jest.requireActual<typeof import('@/trpc/init')>('@/trpc/init');
  return { createDatabaseNodesRouter: jest.fn(() => router({})) };
});
jest.mock('@/jobs/jobs.router', () => {
  const { router } = jest.requireActual<typeof import('@/trpc/init')>('@/trpc/init');
  return { createJobsRouter: jest.fn(() => router({})) };
});
jest.mock('@/mail/mail.router', () => {
  const { router } = jest.requireActual<typeof import('@/trpc/init')>('@/trpc/init');
  return { createMailRouter: jest.fn(() => router({})) };
});
jest.mock('@/applications/applications.router', () => {
  const { router } = jest.requireActual<typeof import('@/trpc/init')>('@/trpc/init');
  return { createApplicationsRouter: jest.fn(() => router({})) };
});
jest.mock('@/users/users.helpers', () => ({
  toSafeUser: jest.fn((user: unknown) => user),
}));

import { createAppRouter, type IRouterServices } from '@/trpc/app-router';
import type { TrpcContext } from '@/trpc/context';
import type { UserWithRelations } from '@/users/users.service';

type TMockUser = NonNullable<TrpcContext['user']>;

const mockUser = { id: 'user_1' } as unknown as TMockUser;

const createMockContext = (user: TMockUser | null = mockUser): TrpcContext => ({
  user,
  req: {} as TrpcContext['req'],
  res: {} as TrpcContext['res'],
});

describe('createAppRouter', () => {
  const mockProfileUpdate = jest.fn();
  const mockAiTest = jest.fn();

  const buildServices = (): IRouterServices => ({
    authService: {} as unknown as IRouterServices['authService'],
    billingService: {} as unknown as IRouterServices['billingService'],
    pipelinesService: {} as unknown as IRouterServices['pipelinesService'],
    profileService: { update: mockProfileUpdate } as unknown as IRouterServices['profileService'],
    usersService: {} as unknown as IRouterServices['usersService'],
    aiService: { test: mockAiTest } as unknown as IRouterServices['aiService'],
    databaseNodesService: {} as unknown as IRouterServices['databaseNodesService'],
    executionsService: {} as unknown as IRouterServices['executionsService'],
    jobsService: {} as unknown as IRouterServices['jobsService'],
    mailService: {} as unknown as IRouterServices['mailService'],
    applicationsService: {} as unknown as IRouterServices['applicationsService'],
  });

  let appRouter: ReturnType<typeof createAppRouter>;

  beforeEach(() => {
    jest.clearAllMocks();
    appRouter = createAppRouter(buildServices());
  });

  describe('profile.update', () => {
    it('calls profileService.update and returns safe user', async () => {
      const updated = { id: 'user_1', email: 'u@e.com', password: 'hash' } as UserWithRelations;
      mockProfileUpdate.mockResolvedValue(updated);

      const caller = appRouter.createCaller(createMockContext());
      const out = await caller.profile.update({ firstName: 'John' });

      expect(mockProfileUpdate).toHaveBeenCalledWith('user_1', { firstName: 'John' });
      expect(out).toEqual(updated);
    });
  });

  describe('ai.test', () => {
    it('calls aiService.test with message and system', async () => {
      mockAiTest.mockResolvedValue('response');

      const caller = appRouter.createCaller(createMockContext());
      const out = await caller.ai.test({ message: 'hi', system: 'sys' });

      expect(mockAiTest).toHaveBeenCalledWith('hi', 'sys');
      expect(out).toBe('response');
    });
  });

  describe('health', () => {
    it('returns status ok', async () => {
      const caller = appRouter.createCaller(createMockContext(null));
      await expect(caller.health()).resolves.toEqual({ status: 'ok' });
    });
  });
});
