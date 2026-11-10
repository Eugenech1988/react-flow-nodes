import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

jest.mock('otplib', () => ({
  generateSecret: jest.fn().mockReturnValue('mock_secret'),
  generateURI: jest.fn().mockReturnValue('mock_uri'),
  verify: jest.fn().mockReturnValue({ valid: true }),
}));

jest.mock('qrcode', () => ({
  toDataURL: jest.fn().mockResolvedValue('mock_qr_code_url'),
}));

jest.mock('argon2', () => ({
  hash: jest.fn().mockResolvedValue('hashed_value'),
  verify: jest.fn().mockResolvedValue(true),
}));

import { AuthService } from '@/auth/auth.service';
import { UsersService } from '@/users/users.service';
import { MailService } from '@/mail/mail.service';
import { PrismaService } from '@/prisma/prisma.service';
import * as argon2 from 'argon2';
import * as otplib from 'otplib';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let jwtService: jest.Mocked<JwtService>;
  let configService: jest.Mocked<ConfigService>;
  let mailService: jest.Mocked<MailService>;
  let prisma: any;

  beforeEach(async () => {
    const mockUsersService = {
      findOneByEmail: jest.fn(),
      findOneByProvider: jest.fn(),
      findOneById: jest.fn(),
      register: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    };

    const mockJwtService = {
      sign: jest.fn().mockReturnValue('mock_token'),
      verify: jest.fn(),
    };

    const mockConfigService = {
      get: jest.fn().mockImplementation((key: string) => {
        if (key === 'CLIENT_URL') return 'http://localhost:5173';
        return 'mock_config_val';
      }),
      getOrThrow: jest.fn().mockReturnValue('mock_secret_or_exp'),
    };

    const mockMailService = {
      sendRecoveryEmail: jest.fn().mockResolvedValue(undefined),
    };

    const mockPrisma = {
      refreshToken: {
        create: jest.fn(),
        findMany: jest.fn(),
        delete: jest.fn(),
        deleteMany: jest.fn(),
      },
      $transaction: jest.fn().mockImplementation((cb) => {
        if (typeof cb === 'function') {
          return cb(mockPrisma);
        }
        return Promise.all(cb);
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: MailService, useValue: mockMailService },
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get(UsersService);
    jwtService = module.get(JwtService);
    configService = module.get(ConfigService);
    mailService = module.get(MailService);
    prisma = module.get(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return sanitized user when email and password match', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        password: 'hashed_password',
        twoFactorSecret: 'secret',
      };
      usersService.findOneByEmail.mockResolvedValue(mockUser as any);
      (argon2.verify as jest.Mock).mockResolvedValueOnce(true);

      const result = await service.validateUser('test@example.com', 'password');

      expect(usersService.findOneByEmail).toHaveBeenCalledWith('test@example.com');
      expect(result).toBeDefined();
      expect(result).not.toHaveProperty('password');
      expect(result).not.toHaveProperty('twoFactorSecret');
    });

    it('should return null when password does not match', async () => {
      usersService.findOneByEmail.mockResolvedValue({ password: 'hashed' } as any);
      (argon2.verify as jest.Mock).mockResolvedValueOnce(false);

      const result = await service.validateUser('test@example.com', 'wrong_pass');

      expect(result).toBeNull();
    });

    it('should return null if user has no password (OAuth user)', async () => {
      usersService.findOneByEmail.mockResolvedValue({ password: null } as any);
      const result = await service.validateUser('test@example.com', 'password');
      expect(result).toBeNull();
    });
  });

  describe('validateOauthUser', () => {
    const oauthProfile = {
      email: 'oauth@example.com',
      firstName: 'Oauth',
      lastName: 'User',
      picture: 'pic.jpg',
      provider: 'google' as const,
      providerId: 'google_123',
      accessToken: 'at',
    };

    it('should return existing user if found by provider', async () => {
      const existingUser = { id: '1', email: 'oauth@example.com' };
      usersService.findOneByProvider.mockResolvedValue(existingUser as any);

      const result = await service.validateOauthUser(oauthProfile);

      expect(usersService.findOneByProvider).toHaveBeenCalledWith('google', 'google_123');
      expect(result).toEqual(existingUser);
    });

    it('should link account to existing email user', async () => {
      const emailUser = { id: '1', email: 'oauth@example.com' };
      const updatedUser = { ...emailUser, provider: 'google' };

      usersService.findOneByProvider.mockResolvedValue(null);
      usersService.findOneByEmail.mockResolvedValue(emailUser as any);
      usersService.update.mockResolvedValue(updatedUser as any);

      const result = await service.validateOauthUser(oauthProfile);

      expect(usersService.update).toHaveBeenCalledWith(
        '1',
        expect.objectContaining({
          provider: 'google',
          providerId: 'google_123',
        }),
      );
      expect(result).toEqual(updatedUser);
    });

    it('should create a new user if not found by provider or email', async () => {
      const newUser = { id: '2', email: 'oauth@example.com' };

      usersService.findOneByProvider.mockResolvedValue(null);
      usersService.findOneByEmail.mockResolvedValue(null);
      usersService.create.mockResolvedValue(newUser as any);

      const result = await service.validateOauthUser(oauthProfile);

      expect(usersService.create).toHaveBeenCalled();
      expect(result).toEqual(newUser);
    });
  });

  describe('generateTokens', () => {
    it('should sign tokens and save hashed refresh token', async () => {
      jwtService.sign.mockReturnValueOnce('access_token').mockReturnValueOnce('refresh_token');

      const result = await service.generateTokens('user_1');

      expect(result).toEqual({
        accessToken: 'access_token',
        refreshToken: 'refresh_token',
      });
      expect(prisma.refreshToken.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            token: 'hashed_value',
            userId: 'user_1',
          }),
        }),
      );
    });
  });

  describe('refreshTokens', () => {
    it('should throw UnauthorizedException if token verification fails', async () => {
      jwtService.verify.mockImplementation(() => {
        throw new Error('JWT error');
      });

      await expect(service.refreshTokens('invalid_token')).rejects.toThrow(UnauthorizedException);
    });

    it('should rotate tokens if valid token record exists', async () => {
      jwtService.verify.mockReturnValue({ userId: 'user_1' });
      prisma.refreshToken.findMany.mockResolvedValue([{ id: 'rt_1', token: 'hashed_rt' }]);
      (argon2.verify as jest.Mock).mockResolvedValueOnce(true);

      jwtService.sign
        .mockReturnValueOnce('new_access_token')
        .mockReturnValueOnce('new_refresh_token');

      const result = await service.refreshTokens('valid_rt');

      expect(prisma.refreshToken.delete).toHaveBeenCalledWith({ where: { id: 'rt_1' } });
      expect(result).toEqual({
        accessToken: 'new_access_token',
        refreshToken: 'new_refresh_token',
      });
    });
  });

  describe('resetPassword', () => {
    it('should throw BadRequestException on invalid recovery token', async () => {
      jwtService.verify.mockImplementation(() => {
        throw new Error('Expired');
      });

      await expect(service.resetPassword({ token: 'bad_token', password: 'new' })).rejects.toThrow(
        'Invalid or expired recovery token',
      );
    });

    it('should update password and delete all refresh tokens in transaction', async () => {
      jwtService.verify.mockReturnValue({ userId: 'user_1', purpose: 'password_recovery' });

      await service.resetPassword({ token: 'valid_token', password: 'new_pass' });

      expect(argon2.hash).toHaveBeenCalledWith('new_pass');
      expect(prisma.$transaction).toHaveBeenCalled();
      expect(usersService.update).toHaveBeenCalledWith('user_1', {
        password: 'hashed_value',
      });
      expect(prisma.refreshToken.deleteMany).toHaveBeenCalledWith({
        where: { userId: 'user_1' },
      });
    });
  });

  describe('generateTwoFactorSecret', () => {
    it('should throw BadRequestException if user is not found', async () => {
      usersService.findOneById.mockResolvedValue(null);
      await expect(service.generateTwoFactorSecret('user_1')).rejects.toThrow(BadRequestException);
    });

    it('should return QR code and save secret', async () => {
      usersService.findOneById.mockResolvedValue({
        id: 'user_1',
        email: 'test@example.com',
      } as any);

      const result = await service.generateTwoFactorSecret('user_1');

      expect(result).toEqual({
        qrCodeImage: 'mock_qr_code_url',
        secret: 'mock_secret',
      });
      expect(usersService.update).toHaveBeenCalledWith('user_1', {
        twoFactorSecret: 'mock_secret',
      });
    });
  });

  describe('turnOnTwoFactor', () => {
    it('should throw BadRequestException if secret is not initialized', async () => {
      usersService.findOneById.mockResolvedValue({ id: 'user_1', twoFactorSecret: null } as any);
      await expect(service.turnOnTwoFactor('user_1', '123456')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should validate OTP, generate recovery codes, and update user', async () => {
      usersService.findOneById.mockResolvedValue({
        id: 'user_1',
        twoFactorSecret: 'secret',
      } as any);
      (otplib.verify as jest.Mock).mockReturnValueOnce({ valid: true });

      const result = await service.turnOnTwoFactor('user_1', '123456');

      expect(result.success).toBe(true);
      expect(result.recoveryCodes).toHaveLength(10);
      expect(usersService.update).toHaveBeenCalledWith('user_1', {
        isTwoFactorEnabled: true,
        recoveryCodes: expect.any(Array),
      });
    });
  });

  describe('turnOffTwoFactor', () => {
    it('should disable 2FA using valid OTP', async () => {
      usersService.findOneById.mockResolvedValue({
        id: 'user_1',
        twoFactorSecret: 'secret',
      } as any);
      (otplib.verify as jest.Mock).mockReturnValueOnce({ valid: true });

      const result = await service.turnOffTwoFactor('user_1', '123456');

      expect(result.success).toBe(true);
      expect(usersService.update).toHaveBeenCalledWith('user_1', {
        isTwoFactorEnabled: false,
        twoFactorSecret: null,
        recoveryCodes: [],
      });
    });

    it('should disable 2FA using a valid recovery code', async () => {
      usersService.findOneById.mockResolvedValue({
        id: 'user_1',
        twoFactorSecret: 'secret',
        recoveryCodes: ['hashed_code'],
      } as any);

      (otplib.verify as jest.Mock).mockReturnValueOnce({ valid: false });
      (argon2.verify as jest.Mock).mockResolvedValueOnce(true);

      const result = await service.turnOffTwoFactor('user_1', 'ABCD-1234');

      expect(result.success).toBe(true);
      expect(usersService.update).toHaveBeenCalledWith(
        'user_1',
        expect.objectContaining({
          isTwoFactorEnabled: false,
        }),
      );
    });
  });

  describe('authenticateWith2Fa', () => {
    it('should throw BadRequestException on invalid temp token', async () => {
      jwtService.verify.mockImplementation(() => {
        throw new Error('Expired');
      });

      await expect(service.authenticateWith2Fa('invalid', '123456')).rejects.toThrow(
        'Invalid or expired temporary token',
      );
    });

    it('should login via OTP and not consume recovery codes', async () => {
      jwtService.verify.mockReturnValue({ userId: 'user_1', purpose: '2fa_pending' });
      usersService.findOneById.mockResolvedValue({
        id: 'user_1',
        twoFactorSecret: 'secret',
        recoveryCodes: ['hashed_code'],
      } as any);

      (otplib.verify as jest.Mock).mockReturnValueOnce({ valid: true });

      const result = await service.authenticateWith2Fa('valid_token', '123456');

      expect(result).toBeDefined();
      expect(usersService.update).not.toHaveBeenCalled();
    });

    it('should login via recovery code and remove used code from DB', async () => {
      jwtService.verify.mockReturnValue({ userId: 'user_1', purpose: '2fa_pending' });
      usersService.findOneById.mockResolvedValue({
        id: 'user_1',
        twoFactorSecret: 'secret',
        recoveryCodes: ['hashed_code_1', 'hashed_code_2'],
      } as any);

      (otplib.verify as jest.Mock).mockReturnValueOnce({ valid: false });

      (argon2.verify as jest.Mock).mockImplementation(async (hashStr) => {
        return hashStr === 'hashed_code_1';
      });

      const result = await service.authenticateWith2Fa('valid_token', 'ABCD-1234');

      expect(result).toBeDefined();
      expect(usersService.update).toHaveBeenCalledWith('user_1', {
        recoveryCodes: ['hashed_code_2'],
      });
    });
  });
});
