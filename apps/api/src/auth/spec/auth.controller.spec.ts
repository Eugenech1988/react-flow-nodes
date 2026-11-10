import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

jest.mock('otplib', () => ({
  generateSecret: jest.fn(),
  generateURI: jest.fn(),
  verify: jest.fn(),
}));
jest.mock('qrcode', () => ({ toDataURL: jest.fn() }));
jest.mock('argon2', () => ({ hash: jest.fn(), verify: jest.fn() }));

import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;
  let configService: jest.Mocked<ConfigService>;

  let mockRes: any;
  let mockReq: any;

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
    configService = module.get(ConfigService);

    mockRes = {
      cookie: jest.fn(),
      clearCookie: jest.fn(),
      setHeader: jest.fn(),
      redirect: jest.fn(),
    };

    mockReq = {
      cookies: {},
      headers: {},
      user: { id: 'user_1', email: 'test@example.com' },
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
      expect(authService.generateTokens).toHaveBeenCalledWith('user_1');
      expect(mockRes.cookie).toHaveBeenCalledTimes(2);
      expect(mockRes.cookie).toHaveBeenCalledWith('accessToken', 'at', expect.any(Object));
      expect(mockRes.cookie).toHaveBeenCalledWith('refreshToken', 'rt', expect.any(Object));
      expect(result).toEqual(user);
    });
  });

  describe('login', () => {
    it('should return temp token if 2FA is required', async () => {
      mockReq.user = { id: 'user_1', isTwoFactorEnabled: true };
      authService.generateTempToken.mockReturnValue('temp_2fa_token');

      const result = await controller.login(mockReq, mockRes);

      expect(authService.generateTempToken).toHaveBeenCalledWith('user_1');
      expect(result).toEqual({
        isTwoFactorRequired: true,
        tempToken: 'temp_2fa_token',
      });
      expect(mockRes.cookie).not.toHaveBeenCalled();
    });

    it('should issue cookies and return user if 2FA is disabled', async () => {
      mockReq.user = { id: 'user_1', isTwoFactorEnabled: false };
      const tokens = { accessToken: 'at', refreshToken: 'rt' };

      authService.generateTokens.mockResolvedValue(tokens);

      const result = await controller.login(mockReq, mockRes);

      expect(authService.generateTokens).toHaveBeenCalledWith('user_1');
      expect(mockRes.cookie).toHaveBeenCalledTimes(2);
      expect(result).toEqual(mockReq.user);
    });
  });

  describe('loginWith2fa', () => {
    it('should complete 2FA login and issue cookies', async () => {
      const dto = { tempToken: 'temp_token', code: '123456' };
      const user = { id: 'user_1', email: 'test@example.com' } as any;
      const tokens = { accessToken: 'at', refreshToken: 'rt' };

      authService.authenticateWith2Fa.mockResolvedValue(user);
      authService.generateTokens.mockResolvedValue(tokens);

      const result = await controller.loginWith2fa(dto, mockRes);

      expect(authService.authenticateWith2Fa).toHaveBeenCalledWith(dto.tempToken, dto.code);
      expect(authService.generateTokens).toHaveBeenCalledWith('user_1');
      expect(mockRes.cookie).toHaveBeenCalledTimes(2);
      expect(result).toEqual(user);
    });
  });

  describe('generate2fa', () => {
    it('should call service to generate 2FA secret', async () => {
      const expectedResult = { qrCodeImage: 'qr_url', secret: 'secret' };
      authService.generateTwoFactorSecret.mockResolvedValue(expectedResult);

      const result = await controller.generate2fa(mockReq);

      expect(authService.generateTwoFactorSecret).toHaveBeenCalledWith('user_1');
      expect(result).toEqual(expectedResult);
    });
  });

  describe('turnOn2fa', () => {
    it('should call service to enable 2FA', async () => {
      const dto = { code: '123456' };
      const expectedResult = { success: true, recoveryCodes: ['code1'] };
      authService.turnOnTwoFactor.mockResolvedValue(expectedResult);

      const result = await controller.turnOn2fa(mockReq, dto);

      expect(authService.turnOnTwoFactor).toHaveBeenCalledWith('user_1', '123456');
      expect(result).toEqual(expectedResult);
    });
  });

  describe('turnOff2fa', () => {
    it('should call service to disable 2FA', async () => {
      const dto = { code: '123456' };
      const expectedResult = { success: true };
      authService.turnOffTwoFactor.mockResolvedValue(expectedResult);

      const result = await controller.turnOff2fa(mockReq, dto);

      expect(authService.turnOffTwoFactor).toHaveBeenCalledWith('user_1', '123456');
      expect(result).toEqual(expectedResult);
    });
  });

  describe('googleAuthCallback', () => {
    it('should validate user, issue cookies, and redirect', async () => {
      const oauthUser = { email: 'test@example.com' } as any;
      const dbUser = { id: 'user_1', email: 'test@example.com' } as any;
      const tokens = { accessToken: 'at', refreshToken: 'rt' };

      mockReq.user = oauthUser;
      authService.validateOauthUser.mockResolvedValue(dbUser);
      authService.generateTokens.mockResolvedValue(tokens);

      await controller.googleAuthCallback(mockReq, mockRes);

      expect(authService.validateOauthUser).toHaveBeenCalledWith(oauthUser);
      expect(mockRes.cookie).toHaveBeenCalledTimes(2);
      expect(mockRes.redirect).toHaveBeenCalledWith('http://localhost:5173');
    });
  });

  describe('githubAuthCallback', () => {
    it('should validate user, issue cookies, and redirect', async () => {
      const oauthUser = { email: 'test@example.com' } as any;
      const dbUser = { id: 'user_1', email: 'test@example.com' } as any;
      const tokens = { accessToken: 'at', refreshToken: 'rt' };

      mockReq.user = oauthUser;
      authService.validateOauthUser.mockResolvedValue(dbUser);
      authService.generateTokens.mockResolvedValue(tokens);

      await controller.githubAuthCallback(mockReq, mockRes);

      expect(authService.validateOauthUser).toHaveBeenCalledWith(oauthUser);
      expect(mockRes.cookie).toHaveBeenCalledTimes(2);
      expect(mockRes.redirect).toHaveBeenCalledWith('http://localhost:5173');
    });
  });

  describe('refresh', () => {
    it('should throw UnauthorizedException if refresh token is missing', async () => {
      mockReq.cookies = {};
      mockReq.headers = {};

      await expect(controller.refresh(mockReq, mockRes)).rejects.toThrow(UnauthorizedException);
    });

    it('should refresh tokens when refresh token is in cookies', async () => {
      mockReq.cookies = { refreshToken: 'valid_rt' };
      const tokens = { accessToken: 'new_at', refreshToken: 'new_rt' };

      authService.refreshTokens.mockResolvedValue(tokens);

      const result = await controller.refresh(mockReq, mockRes);

      expect(authService.refreshTokens).toHaveBeenCalledWith('valid_rt');
      expect(mockRes.cookie).toHaveBeenCalledTimes(2);
      expect(result).toEqual({ success: true });
    });

    it('should refresh tokens when refresh token is in Authorization header', async () => {
      mockReq.cookies = {};
      mockReq.headers = { authorization: 'Bearer valid_header_rt' };
      const tokens = { accessToken: 'new_at', refreshToken: 'new_rt' };

      authService.refreshTokens.mockResolvedValue(tokens);

      const result = await controller.refresh(mockReq, mockRes);

      expect(authService.refreshTokens).toHaveBeenCalledWith('valid_header_rt');
      expect(mockRes.cookie).toHaveBeenCalledTimes(2);
      expect(result).toEqual({ success: true });
    });
  });

  describe('getMe', () => {
    it('should set no-cache headers and return user', () => {
      const result = controller.getMe(mockReq, mockRes);

      expect(mockRes.setHeader).toHaveBeenCalledWith(
        'Cache-Control',
        'no-store, no-cache, must-revalidate, proxy-revalidate',
      );
      expect(mockRes.setHeader).toHaveBeenCalledWith('Pragma', 'no-cache');
      expect(mockRes.setHeader).toHaveBeenCalledWith('Expires', '0');
      expect(result).toEqual(mockReq.user);
    });
  });

  describe('logout', () => {
    it('should clear cookies and revoke token if present', async () => {
      mockReq.cookies = { refreshToken: 'rt_token' };

      const result = await controller.logout(mockReq, mockRes);

      expect(authService.logout).toHaveBeenCalledWith('rt_token');
      expect(mockRes.clearCookie).toHaveBeenCalledWith('accessToken', expect.any(Object));
      expect(mockRes.clearCookie).toHaveBeenCalledWith('refreshToken', expect.any(Object));
      expect(result).toEqual({ success: true });
    });

    it('should clear cookies without calling logout if no refresh token is present', async () => {
      mockReq.cookies = {};

      const result = await controller.logout(mockReq, mockRes);

      expect(authService.logout).not.toHaveBeenCalled();
      expect(mockRes.clearCookie).toHaveBeenCalledTimes(2);
      expect(result).toEqual({ success: true });
    });
  });

  describe('recovery', () => {
    it('should call service to request password reset', async () => {
      const dto = { email: 'test@example.com' };
      const expectedResult = { message: 'Reset link sent' };
      authService.publicRequestResetPassword.mockResolvedValue(expectedResult);

      const result = await controller.recovery(dto);

      expect(authService.publicRequestResetPassword).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('resetPassword', () => {
    it('should call service to reset password', async () => {
      const dto = { token: 'valid_token', password: 'new_password' };
      const expectedResult = { success: true };
      authService.publicResetPassword.mockResolvedValue(expectedResult);

      const result = await controller.resetPassword(dto);

      expect(authService.publicResetPassword).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expectedResult);
    });
  });
});