import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

jest.mock('otplib', () => ({
  generateSecret: jest.fn(),
  generateURI: jest.fn(),
  verify: jest.fn(),
}));

jest.mock('qrcode', () => ({
  toDataURL: jest.fn(),
}));

jest.mock('argon2', () => ({
  hash: jest.fn(),
  verify: jest.fn(),
}));

import { AuthService } from '@/auth/auth.service';
import { UsersService } from '@/users/users.service';
import type { UserWithRelations } from '@/users/users.service';
import { MailService } from '@/mail/mail.service';
import { PrismaService } from '@/prisma/prisma.service';
import type { TOauthUser } from '@/auth/types/auth.types';
import * as argon2 from 'argon2';
import * as otplib from 'otplib';
import * as qrcode from 'qrcode';

type PrismaMock = {
  user: { update: jest.Mock };
  refreshToken: {
    create: jest.Mock;
    findMany: jest.Mock;
    delete: jest.Mock;
    deleteMany: jest.Mock;
  };
  $transaction: jest.Mock;
};

const createMockUser = (overrides: Partial<UserWithRelations> = {}): UserWithRelations =>
  ({
    id: 'user_1',
    email: 'test@example.com',
    password: 'hashed_password',
    hasPassword: true,
    role: 'USER',
    provider: 'local',
    providerId: 'user_1',
    isTwoFactorEnabled: false,
    twoFactorSecret: null,
    recoveryCodes: [],
    currentPipelineId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    profile: null,
    subscription: null,
    currentPipeline: null,
    ...overrides,
  }) as unknown as UserWithRelations;

describe('AuthService', () => {
  let service: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let jwtService: jest.Mocked<JwtService>;
  let configService: jest.Mocked<ConfigService>;
  let mailService: jest.Mocked<MailService>;
  let prisma: PrismaMock;

  beforeEach(async () => {
    jest.resetAllMocks();

    (argon2.hash as jest.Mock).mockResolvedValue('hashed_value');
    (argon2.verify as jest.Mock).mockResolvedValue(true);
    (otplib.generateSecret as jest.Mock).mockReturnValue('mock_secret');
    (otplib.generateURI as jest.Mock).mockReturnValue('mock_uri');
    (otplib.verify as jest.Mock).mockReturnValue({ valid: true });
    (qrcode.toDataURL as jest.Mock).mockResolvedValue('mock_qr_code_url');

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

    const mockPrisma: PrismaMock = {
      user: { update: jest.fn() },
      refreshToken: {
        create: jest.fn(),
        findMany: jest.fn(),
        delete: jest.fn(),
        deleteMany: jest.fn(),
      },
      $transaction: jest.fn(),
    };

    mockPrisma.$transaction.mockImplementation((cb: unknown) => {
      if (typeof cb === 'function') {
        return (cb as (tx: PrismaMock) => unknown)(mockPrisma);
      }
      return Promise.all(cb as unknown[]);
    });

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
    usersService = module.get(UsersService) as jest.Mocked<UsersService>;
    jwtService = module.get(JwtService) as jest.Mocked<JwtService>;
    configService = module.get(ConfigService) as jest.Mocked<ConfigService>;
    mailService = module.get(MailService) as jest.Mocked<MailService>;
    prisma = mockPrisma;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return sanitized user when email and password match', async () => {
      const mockUser = createMockUser();
      usersService.findOneByEmail.mockResolvedValue(mockUser);
      (argon2.verify as jest.Mock).mockResolvedValueOnce(true);

      const result = await service.validateUser('test@example.com', 'password');

      expect(usersService.findOneByEmail).toHaveBeenCalledWith('test@example.com');
      expect(result).toBeDefined();
      expect(result).not.toHaveProperty('password');
      expect(result).not.toHaveProperty('twoFactorSecret');
    });

    it('should return null when password does not match', async () => {
      usersService.findOneByEmail.mockResolvedValue(createMockUser());
      (argon2.verify as jest.Mock).mockResolvedValueOnce(false);

      const result = await service.validateUser('test@example.com', 'wrong_pass');

      expect(result).toBeNull();
    });

    it('should return null if user has no password (OAuth user)', async () => {
      usersService.findOneByEmail.mockResolvedValue(createMockUser({ password: null }));
      const result = await service.validateUser('test@example.com', 'password');
      expect(result).toBeNull();
    });
  });

  describe('validateOauthUser - avatar preservation', () => {
    const baseProfile: TOauthUser = {
      email: 'oauth@example.com',
      firstName: 'Oauth',
      lastName: 'User',
      picture: 'new_pic.jpg',
      provider: 'google',
      providerId: 'google_123',
      accessToken: 'at',
    };

    it('should keep existing avatar when linking to email user', async () => {
      usersService.findOneByProvider.mockResolvedValue(null);
      usersService.findOneByEmail.mockResolvedValue(
        createMockUser({
          id: '1',
          email: 'oauth@example.com',
          profile: {
            id: 'p1',
            userId: '1',
            nickName: 'nick',
            firstName: 'Oauth',
            lastName: 'User',
            avatarUrl: 'existing_avatar.jpg',
            company: null,
            location: null,
            jobTitle: null,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        }),
      );
      usersService.update.mockResolvedValue(createMockUser({ id: '1' }));

      await service.validateOauthUser(baseProfile);

      expect(usersService.update).toHaveBeenCalledWith(
        '1',
        expect.objectContaining({
          profile: expect.objectContaining({
            upsert: expect.objectContaining({
              update: expect.objectContaining({
                avatarUrl: 'existing_avatar.jpg',
              }),
            }),
          }),
        }),
      );
    });

    it('should use OAuth picture when email user has no avatar', async () => {
      usersService.findOneByProvider.mockResolvedValue(null);
      usersService.findOneByEmail.mockResolvedValue(
        createMockUser({ id: '1', email: 'oauth@example.com', profile: null }),
      );
      usersService.update.mockResolvedValue(createMockUser({ id: '1' }));

      await service.validateOauthUser(baseProfile);

      expect(usersService.update).toHaveBeenCalledWith(
        '1',
        expect.objectContaining({
          profile: expect.objectContaining({
            upsert: expect.objectContaining({
              update: expect.objectContaining({
                avatarUrl: 'new_pic.jpg',
              }),
            }),
          }),
        }),
      );
    });
  });

  describe('validateOauthUser - existing user by provider', () => {
    const baseProfile: TOauthUser = {
      email: 'oauth@example.com',
      firstName: 'Oauth',
      lastName: 'User',
      picture: 'new_pic.jpg',
      provider: 'google',
      providerId: 'google_123',
      accessToken: 'at',
    };

    it('should return existing user without touching DB', async () => {
      const existingUser = createMockUser({ id: 'user_existing', email: 'oauth@example.com' });
      usersService.findOneByProvider.mockResolvedValue(existingUser);

      const result = await service.validateOauthUser(baseProfile);

      expect(usersService.findOneByProvider).toHaveBeenCalledWith('google', 'google_123');
      expect(result).not.toHaveProperty('password');
      expect(result).not.toHaveProperty('twoFactorSecret');
      expect(result).not.toHaveProperty('recoveryCodes');
      expect(result).toHaveProperty('id', 'user_existing');

      expect(usersService.findOneByEmail).not.toHaveBeenCalled();
      expect(usersService.update).not.toHaveBeenCalled();
      expect(usersService.create).not.toHaveBeenCalled();
    });
  });

  describe('validateOauthUser - new user creation', () => {
    const baseProfile: TOauthUser = {
      email: 'newuser@example.com',
      firstName: 'New',
      lastName: 'User',
      picture: 'pic.jpg',
      provider: 'google',
      providerId: 'google_new',
      accessToken: 'at',
    };

    it('should create a new user when not found by provider or email', async () => {
      usersService.findOneByProvider.mockResolvedValue(null);
      usersService.findOneByEmail.mockResolvedValue(null);
      usersService.create.mockResolvedValue(
        createMockUser({
          id: 'new_id',
          email: 'newuser@example.com',
          profile: {
            id: 'p1',
            userId: 'new_id',
            nickName: 'newuser',
            firstName: 'New',
            lastName: 'User',
            avatarUrl: 'pic.jpg',
            company: null,
            location: null,
            jobTitle: null,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        }),
      );

      const result = await service.validateOauthUser(baseProfile);

      expect(usersService.create).toHaveBeenCalledWith({
        email: 'newuser@example.com',
        provider: 'google',
        providerId: 'google_new',
        profile: {
          create: {
            firstName: 'New',
            lastName: 'User',
            avatarUrl: 'pic.jpg',
          },
        },
      });
      expect(result).toHaveProperty('id', 'new_id');
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

    it('should throw "Token revoked or invalid" when DB is empty', async () => {
      jwtService.verify.mockReturnValue({ userId: 'user_1' });
      prisma.refreshToken.findMany.mockResolvedValue([]);

      await expect(service.refreshTokens('orphaned')).rejects.toThrow('Token revoked or invalid');
      expect(argon2.verify).not.toHaveBeenCalled();
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

      await expect(
        service.resetPassword({ token: 'bad_token', password: 'new_password' }),
      ).rejects.toThrow('Invalid or expired recovery token');
    });

    it('should update password and delete all refresh tokens in transaction', async () => {
      jwtService.verify.mockReturnValue({ userId: 'user_1', purpose: 'password_recovery' });
      prisma.user.update.mockResolvedValue({ id: 'user_1' });
      prisma.refreshToken.deleteMany.mockResolvedValue({ count: 2 });

      await service.resetPassword({ token: 'valid_token', password: 'new_password' });

      expect(argon2.hash).toHaveBeenCalledWith('new_password');
      expect(prisma.$transaction).toHaveBeenCalled();

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user_1' },
        data: { password: 'hashed_value' },
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
      usersService.findOneById.mockResolvedValue(
        createMockUser({ id: 'user_1', email: 'test@example.com' }),
      );

      const result = await service.generateTwoFactorSecret('user_1');

      expect(result).toEqual({
        qrCodeImage: 'mock_qr_code_url',
        secret: 'mock_secret',
      });
      expect(usersService.update).toHaveBeenCalledWith('user_1', {
        twoFactorSecret: 'mock_secret',
      });
    });

    it('should return qrCodeImage and secret together', async () => {
      usersService.findOneById.mockResolvedValue(
        createMockUser({ id: 'user_1', email: 'a@b.com' }),
      );
      (otplib.generateSecret as jest.Mock).mockReturnValueOnce('SECRET123');
      (qrcode.toDataURL as jest.Mock).mockResolvedValueOnce('data:image/png;base64,xyz');

      const result = await service.generateTwoFactorSecret('user_1');

      expect(result).toEqual({
        qrCodeImage: 'data:image/png;base64,xyz',
        secret: 'SECRET123',
      });
    });
  });

  describe('turnOnTwoFactor', () => {
    it('should throw BadRequestException if secret is not initialized', async () => {
      usersService.findOneById.mockResolvedValue(
        createMockUser({ id: 'user_1', twoFactorSecret: null }),
      );
      await expect(service.turnOnTwoFactor('user_1', '123456')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should validate OTP, generate recovery codes, and update user', async () => {
      usersService.findOneById.mockResolvedValue(
        createMockUser({ id: 'user_1', twoFactorSecret: 'secret' }),
      );
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
      usersService.findOneById.mockResolvedValue(
        createMockUser({ id: 'user_1', twoFactorSecret: 'secret' }),
      );
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
      usersService.findOneById.mockResolvedValue(
        createMockUser({
          id: 'user_1',
          twoFactorSecret: 'secret',
          recoveryCodes: ['hashed_code'],
        }),
      );

      (otplib.verify as jest.Mock).mockReturnValueOnce({ valid: false });
      (argon2.verify as jest.Mock).mockResolvedValueOnce(true);

      const result = await service.turnOffTwoFactor('user_1', 'ABCD-1234');

      expect(result.success).toBe(true);
      expect(usersService.update).toHaveBeenCalledWith(
        'user_1',
        expect.objectContaining({ isTwoFactorEnabled: false }),
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
      usersService.findOneById.mockResolvedValue(
        createMockUser({
          id: 'user_1',
          twoFactorSecret: 'secret',
          recoveryCodes: ['hashed_code'],
        }),
      );

      (otplib.verify as jest.Mock).mockReturnValueOnce({ valid: true });

      const result = await service.authenticateWith2Fa('valid_token', '123456');

      expect(result).toBeDefined();
      expect(usersService.update).not.toHaveBeenCalled();
    });

    it('should login via recovery code and remove used code from DB', async () => {
      jwtService.verify.mockReturnValue({ userId: 'user_1', purpose: '2fa_pending' });
      usersService.findOneById.mockResolvedValue(
        createMockUser({
          id: 'user_1',
          twoFactorSecret: 'secret',
          recoveryCodes: ['hashed_code_1', 'hashed_code_2'],
        }),
      );

      (otplib.verify as jest.Mock).mockReturnValueOnce({ valid: false });

      (argon2.verify as jest.Mock).mockImplementation(async (hashStr: string) => {
        return hashStr === 'hashed_code_1';
      });

      const result = await service.authenticateWith2Fa('valid_token', 'ABCD-1234');

      expect(result).toBeDefined();
      expect(usersService.update).toHaveBeenCalledWith('user_1', {
        recoveryCodes: ['hashed_code_2'],
      });
    });
  });

  describe('logout', () => {
    it('should return silently if token verification fails', async () => {
      jwtService.verify.mockImplementation(() => {
        throw new Error('Invalid');
      });

      await expect(service.logout('invalid_token')).resolves.toBeUndefined();
      expect(prisma.refreshToken.findMany).not.toHaveBeenCalled();
    });

    it('should return silently if no matching token in DB', async () => {
      jwtService.verify.mockReturnValue({ userId: 'user_1' });
      prisma.refreshToken.findMany.mockResolvedValue([{ id: 'rt_1', token: 'other_hash' }]);
      (argon2.verify as jest.Mock).mockResolvedValue(false);

      await service.logout('valid_rt');

      expect(prisma.refreshToken.delete).not.toHaveBeenCalled();
    });

    it('should delete matching token', async () => {
      jwtService.verify.mockReturnValue({ userId: 'user_1' });
      prisma.refreshToken.findMany.mockResolvedValue([{ id: 'rt_1', token: 'hashed' }]);
      (argon2.verify as jest.Mock).mockResolvedValue(true);
      prisma.refreshToken.delete.mockResolvedValue({});

      await service.logout('valid_rt');

      expect(prisma.refreshToken.delete).toHaveBeenCalledWith({ where: { id: 'rt_1' } });
    });
  });

  describe('recovery', () => {
    it('should return null if user not found', async () => {
      usersService.findOneByEmail.mockResolvedValue(null);
      const result = await service.recovery({ email: 'nope@example.com' });
      expect(result).toBeNull();
    });

    it('should return reset token if user exists', async () => {
      usersService.findOneByEmail.mockResolvedValue(createMockUser());
      jwtService.sign.mockReturnValue('reset_token');

      const result = await service.recovery({ email: 'a@b.com' });

      expect(result).toBe('reset_token');
      expect(jwtService.sign).toHaveBeenCalledWith(
        { userId: 'user_1', purpose: 'password_recovery' },
        expect.any(Object),
      );
    });
  });

  describe('publicRequestResetPassword', () => {
    it('should send email when user exists', async () => {
      usersService.findOneByEmail.mockResolvedValue(createMockUser());
      jwtService.sign.mockReturnValue('reset_token');
      mailService.sendRecoveryEmail.mockResolvedValue(undefined);

      const result = await service.publicRequestResetPassword({ email: 'a@b.com' });

      expect(mailService.sendRecoveryEmail).toHaveBeenCalledWith(
        'a@b.com',
        expect.stringContaining('http://localhost:5173/login?token=reset_token'),
      );
      expect(result.message).toBeDefined();
    });

    it('should not send email when user does not exist', async () => {
      usersService.findOneByEmail.mockResolvedValue(null);

      const result = await service.publicRequestResetPassword({ email: 'nope@b.com' });

      expect(mailService.sendRecoveryEmail).not.toHaveBeenCalled();
      expect(result.message).toBeDefined();
    });
  });

  describe('publicResetPassword', () => {
    it('should call resetPassword and return success', async () => {
      jwtService.verify.mockReturnValue({ userId: 'user_1', purpose: 'password_recovery' });
      prisma.user.update.mockResolvedValue({});
      prisma.refreshToken.deleteMany.mockResolvedValue({ count: 1 });

      const result = await service.publicResetPassword({
        token: 'valid_token',
        password: 'new_password',
      });

      expect(result).toEqual({ success: true });
    });
  });

  describe('resetPassword - invalid purpose', () => {
    it('should throw BadRequestException if token purpose is invalid', async () => {
      jwtService.verify.mockReturnValue({ userId: 'user_1', purpose: 'wrong_purpose' });

      await expect(
        service.resetPassword({ token: 'valid_token', password: 'new_password' }),
      ).rejects.toThrow('Invalid token purpose');
    });
  });

  describe('regenerateRecoveryCodes', () => {
    it('should throw BadRequestException if user not found', async () => {
      usersService.findOneById.mockResolvedValue(null);
      await expect(service.regenerateRecoveryCodes('user_1')).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if 2FA is not enabled', async () => {
      usersService.findOneById.mockResolvedValue(
        createMockUser({ id: 'user_1', isTwoFactorEnabled: false }),
      );
      await expect(service.regenerateRecoveryCodes('user_1')).rejects.toThrow(BadRequestException);
    });

    it('should regenerate 10 recovery codes', async () => {
      usersService.findOneById.mockResolvedValue(
        createMockUser({ id: 'user_1', isTwoFactorEnabled: true }),
      );
      usersService.update.mockResolvedValue(createMockUser());

      const result = await service.regenerateRecoveryCodes('user_1');

      expect(result.recoveryCodes).toHaveLength(10);
      expect(usersService.update).toHaveBeenCalledWith(
        'user_1',
        expect.objectContaining({ recoveryCodes: expect.any(Array) }),
      );
    });
  });

  describe('generateTempToken', () => {
    it('should sign a token with 2fa_pending purpose', () => {
      jwtService.sign.mockReturnValueOnce('temp_token_xyz');

      const result = service.generateTempToken('user_1');

      expect(result).toBe('temp_token_xyz');
      expect(jwtService.sign).toHaveBeenCalledWith(
        { userId: 'user_1', purpose: '2fa_pending' },
        expect.objectContaining({
          secret: expect.any(String),
          expiresIn: expect.anything(),
        }),
      );
    });

    it('should propagate jwtService.sign errors', () => {
      jwtService.sign.mockImplementationOnce(() => {
        throw new Error('Signing failed');
      });

      expect(() => service.generateTempToken('user_1')).toThrow('Signing failed');
    });
  });

  describe('turnOnTwoFactor - invalid OTP branch', () => {
    it('should throw BadRequestException if OTP is invalid', async () => {
      usersService.findOneById.mockResolvedValue(
        createMockUser({ id: 'user_1', twoFactorSecret: 'secret' }),
      );
      (otplib.verify as jest.Mock).mockReturnValueOnce({ valid: false });

      await expect(service.turnOnTwoFactor('user_1', '123456')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('turnOffTwoFactor - 2FA not initialized', () => {
    it('should throw BadRequestException if user has no twoFactorSecret', async () => {
      usersService.findOneById.mockResolvedValue(
        createMockUser({ id: 'user_1', twoFactorSecret: null }),
      );

      await expect(service.turnOffTwoFactor('user_1', '123456')).rejects.toThrow(
        '2FA not initialized',
      );
    });

    it('should throw BadRequestException if user is not found', async () => {
      usersService.findOneById.mockResolvedValue(null);

      await expect(service.turnOffTwoFactor('user_1', '123456')).rejects.toThrow(
        '2FA not initialized',
      );
    });
  });

  describe('turnOffTwoFactor - invalid code branches', () => {
    it('should throw BadRequestException if code is invalid', async () => {
      usersService.findOneById.mockResolvedValue(
        createMockUser({ id: 'user_1', twoFactorSecret: 'secret', recoveryCodes: [] }),
      );
      (otplib.verify as jest.Mock).mockReturnValueOnce({ valid: false });

      await expect(service.turnOffTwoFactor('user_1', '123456')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should catch otplib.verify throws and still try recovery codes', async () => {
      usersService.findOneById.mockResolvedValue(
        createMockUser({ id: 'user_1', twoFactorSecret: 'secret', recoveryCodes: [] }),
      );
      (otplib.verify as jest.Mock).mockImplementationOnce(() => {
        throw new Error('bad input');
      });

      await expect(service.turnOffTwoFactor('user_1', '123456')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('authenticateWith2Fa - extra branches', () => {
    it('should throw if token purpose is invalid', async () => {
      jwtService.verify.mockReturnValue({ userId: 'user_1', purpose: 'wrong_purpose' });
      await expect(service.authenticateWith2Fa('token', '123456')).rejects.toThrow(
        'Invalid token purpose',
      );
    });

    it('should throw if user is not found', async () => {
      jwtService.verify.mockReturnValue({ userId: 'user_1', purpose: '2fa_pending' });
      usersService.findOneById.mockResolvedValue(null);

      await expect(service.authenticateWith2Fa('token', '123456')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw if both OTP and recovery codes fail', async () => {
      jwtService.verify.mockReturnValue({ userId: 'user_1', purpose: '2fa_pending' });
      usersService.findOneById.mockResolvedValue(
        createMockUser({
          id: 'user_1',
          twoFactorSecret: 'secret',
          recoveryCodes: ['hashed_code'],
        }),
      );
      (otplib.verify as jest.Mock).mockReturnValueOnce({ valid: false });
      (argon2.verify as jest.Mock).mockResolvedValueOnce(false);

      await expect(service.authenticateWith2Fa('token', '123456')).rejects.toThrow(
        'Invalid authenticator code',
      );
    });

    it('should handle otplib.verify throws in 2FA path', async () => {
      jwtService.verify.mockReturnValue({ userId: 'user_1', purpose: '2fa_pending' });
      usersService.findOneById.mockResolvedValue(
        createMockUser({ id: 'user_1', twoFactorSecret: 'secret', recoveryCodes: [] }),
      );
      (otplib.verify as jest.Mock).mockImplementationOnce(() => {
        throw new Error('bad');
      });

      await expect(service.authenticateWith2Fa('token', '123456')).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
