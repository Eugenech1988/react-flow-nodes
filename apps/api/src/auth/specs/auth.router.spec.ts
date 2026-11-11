import { createAuthRouter } from '../auth.router';
import type { AuthService } from '../auth.service';
import type { TrpcContext } from '@/trpc/context';

describe('Auth Router', () => {
  let mockAuthService: jest.Mocked<AuthService>;
  let router: ReturnType<typeof createAuthRouter>;

  type TMockUser = NonNullable<TrpcContext['user']>;

  const mockUser = {
    id: 'user_1',
    email: 'test@example.com',
    role: 'USER',
    isTwoFactorEnabled: false,
    password: 'hashed',
    twoFactorSecret: null,
    recoveryCodes: [],
  } as unknown as TMockUser;

  const mockRes = {
    cookie: jest.fn(),
    clearCookie: jest.fn(),
  };

  const createMockContext = (
    user: TMockUser | null,
    cookies: Record<string, string> = {},
  ): TrpcContext => ({
    user,
    req: { cookies } as unknown as TrpcContext['req'],
    res: mockRes as unknown as TrpcContext['res'],
  });

  beforeEach(() => {
    mockAuthService = {
      validateUser: jest.fn(),
      generateTokens: jest.fn(),
      generateTempToken: jest.fn(),
      authenticateWith2Fa: jest.fn(),
      generateTwoFactorSecret: jest.fn(),
      turnOnTwoFactor: jest.fn(),
      turnOffTwoFactor: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
      publicRequestResetPassword: jest.fn(),
      publicResetPassword: jest.fn(),
    } as unknown as jest.Mocked<AuthService>;

    router = createAuthRouter(mockAuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('me', () => {
    it('should return null if user is not authenticated', async () => {
      const caller = router.createCaller(createMockContext(null));
      const result = await caller.me();
      expect(result).toBeNull();
    });

    it('should return safe user without password', async () => {
      const caller = router.createCaller(createMockContext(mockUser));
      const result = await caller.me();
      expect(result).toEqual(expect.objectContaining({ id: 'user_1' }));
      expect(result).not.toHaveProperty('password');
      expect(result).not.toHaveProperty('twoFactorSecret');
    });
  });

  describe('login', () => {
    it('should throw UNAUTHORIZED on invalid credentials', async () => {
      mockAuthService.validateUser.mockResolvedValue(null);
      const caller = router.createCaller(createMockContext(null));

      await expect(
        caller.login({ email: 'a@b.com', password: 'wrong_password' }),
      ).rejects.toMatchObject({ code: 'UNAUTHORIZED', message: 'Invalid credentials' });
    });

    it('should return tempToken if 2FA is enabled', async () => {
      mockAuthService.validateUser.mockResolvedValue({
        ...mockUser,
        isTwoFactorEnabled: true,
      } as TMockUser);
      mockAuthService.generateTempToken.mockReturnValue('temp_token');

      const caller = router.createCaller(createMockContext(null));
      const result = await caller.login({ email: 'a@b.com', password: 'correct_password' });

      expect(result).toEqual({ isTwoFactorRequired: true, tempToken: 'temp_token' });
      expect(mockRes.cookie).not.toHaveBeenCalled();
    });

    it('should set cookies and return safe user on success', async () => {
      mockAuthService.validateUser.mockResolvedValue(mockUser);
      mockAuthService.generateTokens.mockResolvedValue({ accessToken: 'at', refreshToken: 'rt' });

      const caller = router.createCaller(createMockContext(null));
      const result = await caller.login({ email: 'a@b.com', password: 'correct_password' });

      expect(mockRes.cookie).toHaveBeenCalledTimes(2);
      expect(result).toHaveProperty('isTwoFactorRequired', false);
      expect(result).not.toHaveProperty('password');
    });
  });

  describe('loginWith2fa', () => {
    it('should authenticate, set cookies, and return safe user', async () => {
      mockAuthService.authenticateWith2Fa.mockResolvedValue(mockUser);
      mockAuthService.generateTokens.mockResolvedValue({ accessToken: 'at', refreshToken: 'rt' });

      const caller = router.createCaller(createMockContext(null));
      const result = await caller.loginWith2fa({ tempToken: 'tt', code: '123456' });

      expect(mockAuthService.authenticateWith2Fa).toHaveBeenCalledWith('tt', '123456');
      expect(mockRes.cookie).toHaveBeenCalledTimes(2);
      expect(result).not.toHaveProperty('password');
    });
  });

  describe('generate2fa', () => {
    it('should call service with user id', async () => {
      mockAuthService.generateTwoFactorSecret.mockResolvedValue({
        qrCodeImage: 'qr',
        secret: 'secret',
      });

      const caller = router.createCaller(createMockContext(mockUser));
      const result = await caller.generate2fa();

      expect(mockAuthService.generateTwoFactorSecret).toHaveBeenCalledWith('user_1');
      expect(result).toEqual({ qrCodeImage: 'qr', secret: 'secret' });
    });

    it('should throw UNAUTHORIZED without user', async () => {
      const caller = router.createCaller(createMockContext(null));
      await expect(caller.generate2fa()).rejects.toMatchObject({ code: 'UNAUTHORIZED' });
    });
  });

  describe('turnOn2fa', () => {
    it('should call service with user id and code', async () => {
      mockAuthService.turnOnTwoFactor.mockResolvedValue({
        success: true,
        recoveryCodes: ['code1'],
      });

      const caller = router.createCaller(createMockContext(mockUser));
      const result = await caller.turnOn2fa({ code: '123456' });

      expect(mockAuthService.turnOnTwoFactor).toHaveBeenCalledWith('user_1', '123456');
      expect(result.success).toBe(true);
    });
  });

  describe('turnOff2fa', () => {
    it('should call service with user id and code', async () => {
      mockAuthService.turnOffTwoFactor.mockResolvedValue({ success: true });

      const caller = router.createCaller(createMockContext(mockUser));
      const result = await caller.turnOff2fa({ code: '123456' });

      expect(mockAuthService.turnOffTwoFactor).toHaveBeenCalledWith('user_1', '123456');
      expect(result.success).toBe(true);
    });
  });

  describe('register', () => {
    it('should register, set cookies, and return safe user', async () => {
      mockAuthService.register.mockResolvedValue(mockUser);
      mockAuthService.generateTokens.mockResolvedValue({ accessToken: 'at', refreshToken: 'rt' });

      const caller = router.createCaller(createMockContext(null));
      const result = await caller.register({
        email: 'a@b.com',
        password: 'password123',
        firstName: 'John',
      });

      expect(mockRes.cookie).toHaveBeenCalledTimes(2);
      expect(result).not.toHaveProperty('password');
    });
  });

  describe('logout', () => {
    it('should call authService.logout if refresh token exists', async () => {
      const caller = router.createCaller(createMockContext(null, { refreshToken: 'rt_token' }));

      await caller.logout();

      expect(mockAuthService.logout).toHaveBeenCalledWith('rt_token');
      expect(mockRes.clearCookie).toHaveBeenCalledTimes(2);
    });

    it('should clear cookies without calling authService.logout if no token', async () => {
      const caller = router.createCaller(createMockContext(null, {}));

      await caller.logout();

      expect(mockAuthService.logout).not.toHaveBeenCalled();
      expect(mockRes.clearCookie).toHaveBeenCalledTimes(2);
    });
  });

  describe('requestPasswordReset', () => {
    it('should call service and return message', async () => {
      mockAuthService.publicRequestResetPassword.mockResolvedValue({
        message: 'If the email exists, a reset link has been sent.',
      });

      const caller = router.createCaller(createMockContext(null));
      const result = await caller.requestPasswordReset({ email: 'a@b.com' });

      expect(result.message).toBeDefined();
      expect(mockAuthService.publicRequestResetPassword).toHaveBeenCalledWith({ email: 'a@b.com' });
    });
  });

  describe('resetPassword', () => {
    it('should call service and return success', async () => {
      mockAuthService.publicResetPassword.mockResolvedValue({ success: true });

      const caller = router.createCaller(createMockContext(null));
      const result = await caller.resetPassword({ token: 'valid', password: 'new_password' });

      expect(result).toEqual({ success: true });
      expect(mockAuthService.publicResetPassword).toHaveBeenCalledWith({
        token: 'valid',
        password: 'new_password',
      });
    });
  });
});
