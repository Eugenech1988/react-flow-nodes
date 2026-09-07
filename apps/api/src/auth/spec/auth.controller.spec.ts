import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthController } from '@/auth/auth.controller';
import { AuthService } from '@/auth/auth.service';

jest.mock('otplib', () => ({
  generateSecret: jest.fn().mockReturnValue('mock_secret'),
  generateURI: jest.fn().mockReturnValue('mock_uri'),
  verify: jest.fn().mockReturnValue({ valid: true }),
}));

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;
  let mockRes: any;

  beforeEach(async () => {
    const mockAuthService = {
      register: jest.fn(),
      generateTokens: jest.fn(),
      generateTempToken: jest.fn(),
      authenticateWith2Fa: jest.fn(),
      generateTwoFactorSecret: jest.fn(),
      turnOnTwoFactor: jest.fn(),
      turnOffTwoFactor: jest.fn(),
      validateOauthUser: jest.fn(),
      refreshTokens: jest.fn(),
      logout: jest.fn(),
      publicRequestResetPassword: jest.fn(),
      publicResetPassword: jest.fn(),
    };

    const mockConfigService = {
      get: jest.fn().mockReturnValue('http://localhost:5173'),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);

    mockRes = {
      cookie: jest.fn(),
      clearCookie: jest.fn(),
      setHeader: jest.fn(),
      redirect: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should register user and set auth cookies', async () => {
      const dto = { email: 'test@example.com', password: 'password123' };
      const user = { id: 'user_1', email: 'test@example.com' } as any;
      const tokens = { accessToken: 'at', refreshToken: 'rt' };

      authService.register.mockResolvedValue(user);
      authService.generateTokens.mockResolvedValue(tokens);

      const result = await controller.register(dto, mockRes);

      expect(authService.register).toHaveBeenCalledWith(dto);
      expect(mockRes.cookie).toHaveBeenCalledTimes(2);
      expect(result).toEqual(user);
    });
  });

  describe('login', () => {
    it('should return temp token if 2FA is required', async () => {
      const req = { user: { id: 'user_1', isTwoFactorEnabled: true } } as any;
      authService.generateTempToken.mockReturnValue('temp_2fa_token');

      const result = await controller.login(req, mockRes);

      expect(result).toEqual({
        isTwoFactorRequired: true,
        tempToken: 'temp_2fa_token',
      });
      expect(mockRes.cookie).not.toHaveBeenCalled();
    });

    it('should issue cookies and return user if 2FA is disabled', async () => {
      const req = { user: { id: 'user_1', isTwoFactorEnabled: false } } as any;
      const tokens = { accessToken: 'at', refreshToken: 'rt' };

      authService.generateTokens.mockResolvedValue(tokens);

      const result = await controller.login(req, mockRes);

      expect(mockRes.cookie).toHaveBeenCalledTimes(2);
      expect(result).toEqual(req.user);
    });
  });

  describe('refresh', () => {
    it('should throw UnauthorizedException if refresh token cookie is missing', async () => {
      const req = { cookies: {}, headers: {} } as any;

      await expect(controller.refresh(req, mockRes)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should refresh tokens when refresh token is present in cookies', async () => {
      const req = { cookies: { refreshToken: 'valid_rt' } } as any;
      const tokens = { accessToken: 'new_at', refreshToken: 'new_rt' };

      authService.refreshTokens.mockResolvedValue(tokens);

      const result = await controller.refresh(req, mockRes);

      expect(authService.refreshTokens).toHaveBeenCalledWith('valid_rt');
      expect(mockRes.cookie).toHaveBeenCalledTimes(2);
      expect(result).toEqual({ success: true });
    });
  });

  describe('getMe', () => {
    it('should set no-cache headers and return user', () => {
      const req = { user: { id: 'user_1', email: 'test@example.com' } } as any;

      const result = controller.getMe(req, mockRes);

      expect(mockRes.setHeader).toHaveBeenCalledWith(
        'Cache-Control',
        'no-store, no-cache, must-revalidate, proxy-revalidate',
      );
      expect(result).toEqual(req.user);
    });
  });

  describe('logout', () => {
    it('should clear cookies and revoke token if present', async () => {
      const req = { cookies: { refreshToken: 'rt_token' } } as any;

      const result = await controller.logout(req, mockRes);

      expect(authService.logout).toHaveBeenCalledWith('rt_token');
      expect(mockRes.clearCookie).toHaveBeenCalledWith(
        'accessToken',
        expect.any(Object),
      );
      expect(mockRes.clearCookie).toHaveBeenCalledWith(
        'refreshToken',
        expect.any(Object),
      );
      expect(result).toEqual({ success: true });
    });
  });
});