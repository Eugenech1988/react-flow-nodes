import { createUsersRouter } from '../users.router';
import type { UsersService, UserWithRelations } from '../users.service';
import type { TrpcContext } from '@/trpc/context';

type TMockUser = NonNullable<TrpcContext['user']>;
type TMockUsersService = jest.Mocked<
  Pick<UsersService, 'updatePassword' | 'delete' | 'setCurrentPipeline'>
>;

const createMockUsersService = (): TMockUsersService => ({
  updatePassword: jest.fn(),
  delete: jest.fn(),
  setCurrentPipeline: jest.fn(),
});

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

describe('Users Router', () => {
  let mockUsersService: TMockUsersService;
  let router: ReturnType<typeof createUsersRouter>;

  beforeEach(() => {
    mockUsersService = createMockUsersService();
    router = createUsersRouter(mockUsersService as unknown as UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('updatePassword', () => {
    it('delegates with user id and input', async () => {
      mockUsersService.updatePassword.mockResolvedValue({ success: true });

      const caller = router.createCaller(createMockContext());
      const result = await caller.updatePassword({ newPassword: 'newPassword123' });

      expect(mockUsersService.updatePassword).toHaveBeenCalledWith('user_1', {
        newPassword: 'newPassword123',
      });
      expect(result).toEqual({ success: true });
    });

    it('rejects unauthenticated callers', async () => {
      const caller = router.createCaller(createMockContext(null));
      await expect(caller.updatePassword({ newPassword: 'newPassword123' })).rejects.toMatchObject({
        code: 'UNAUTHORIZED',
      });
    });
  });

  describe('remove', () => {
    it('delegates to usersService.delete', async () => {
      mockUsersService.delete.mockResolvedValue(undefined);

      const caller = router.createCaller(createMockContext());
      const result = await caller.remove();

      expect(mockUsersService.delete).toHaveBeenCalledWith('user_1');
      expect(result).toEqual({ success: true });
    });

    it('rejects unauthenticated callers', async () => {
      const caller = router.createCaller(createMockContext(null));
      await expect(caller.remove()).rejects.toMatchObject({ code: 'UNAUTHORIZED' });
    });
  });

  describe('setCurrentPipeline', () => {
    it('delegates and returns safe user', async () => {
      const updatedUser = {
        id: 'user_1',
        password: 'hash',
        twoFactorSecret: 'secret',
        recoveryCodes: ['code'],
        email: 'test@example.com',
      } as unknown as UserWithRelations;
      mockUsersService.setCurrentPipeline.mockResolvedValue(updatedUser);

      const caller = router.createCaller(createMockContext());
      const result = await caller.setCurrentPipeline({ id: 'pipe_1' });

      expect(mockUsersService.setCurrentPipeline).toHaveBeenCalledWith('user_1', 'pipe_1');
      expect(result).not.toHaveProperty('password');
      expect(result).not.toHaveProperty('twoFactorSecret');
      expect(result).not.toHaveProperty('recoveryCodes');
      expect(result).toHaveProperty('email', 'test@example.com');
    });

    it('rejects unauthenticated callers', async () => {
      const caller = router.createCaller(createMockContext(null));
      await expect(caller.setCurrentPipeline({ id: 'pipe_1' })).rejects.toMatchObject({
        code: 'UNAUTHORIZED',
      });
    });
  });
});
