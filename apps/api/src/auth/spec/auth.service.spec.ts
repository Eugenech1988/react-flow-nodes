import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '@/auth/auth.service';
import { UsersService } from '@/users/users.service';
import { MailService } from '@/mail/mail.service';
import { PrismaService } from '@/prisma/prisma.service';
import * as argon2 from 'argon2';

jest.mock('argon2', () => ({
  hash: jest.fn().mockResolvedValue('hashed_value'),
  verify: jest.fn().mockResolvedValue(true),
}));

jest.mock('otplib', () => ({
  generateSecret: jest.fn().mockReturnValue('mock_secret'),
  generateURI: jest.fn().mockReturnValue('mock_uri'),
  verify: jest.fn().mockReturnValue({ valid: true }),
}));

jest.mock('qrcode', () => ({
  toDataURL: jest.fn().mockResolvedValue('mock_qr_code_url'),
}));

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
      },
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
  });

  describe('generateTokens', () => {
    it('should sign access and refresh tokens and save hashed refresh token in DB', async () => {
      jwtService.sign
        .mockReturnValueOnce('access_token')
        .mockReturnValueOnce('refresh_token');

      const result = await service.generateTokens('user_1');

      expect(result).toEqual({
        accessToken: 'access_token',
        refreshToken: 'refresh_token',
      });
      expect(prisma.refreshToken.create).toHaveBeenCalled();
    });
  });

  describe('refreshTokens', () => {
    it('should throw UnauthorizedException if refresh token verification fails', async () => {
      jwtService.verify.mockImplementation(() => {
        throw new Error('JWT error');
      });

      await expect(service.refreshTokens('invalid_token')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should refresh tokens if valid token record exists', async () => {
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

  describe('generateTwoFactorSecret', () => {
    it('should throw BadRequestException if user is not found', async () => {
      usersService.findOneById.mockResolvedValue(null);

      await expect(service.generateTwoFactorSecret('user_1')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should return QR code image and secret', async () => {
      usersService.findOneById.mockResolvedValue({ id: 'user_1', email: 'test@example.com' } as any);

      const result = await service.generateTwoFactorSecret('user_1');

      expect(result).toEqual({
        qrCodeImage: 'mock_qr_code_url',
        secret: 'mock_secret',
      });
      expect(usersService.update).toHaveBeenCalledWith('user_1', { twoFactorSecret: 'mock_secret' });
    });
  });

  describe('turnOnTwoFactor', () => {
    it('should enable 2FA and return recovery codes', async () => {
      usersService.findOneById.mockResolvedValue({ id: 'user_1', twoFactorSecret: 'secret' } as any);

      const result = await service.turnOnTwoFactor('user_1', '123456');

      expect(result.success).toBe(true);
      expect(result.recoveryCodes).toHaveLength(10);
      expect(usersService.update).toHaveBeenCalledWith(
        'user_1',
        expect.objectContaining({ isTwoFactorEnabled: true }),
      );
    });
  });

  describe('resetPassword', () => {
    it('should throw BadRequestException on invalid recovery token', async () => {
      jwtService.verify.mockImplementation(() => {
        throw new Error('Expired');
      });

      await expect(
        service.resetPassword({ token: 'bad_token', password: 'new' }),
      ).rejects.toThrow('Invalid or expired recovery token');
    });

    it('should update user password if token is valid', async () => {
      jwtService.verify.mockReturnValue({ userId: 'user_1', purpose: 'password_recovery' });

      await service.resetPassword({ token: 'valid_token', password: 'new_pass' });

      expect(argon2.hash).toHaveBeenCalledWith('new_pass');
      expect(usersService.update).toHaveBeenCalledWith('user_1', {
        password: 'hashed_value',
      });
    });
  });
});