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

import { JwtAccessStrategy } from '../strategies/jwt-access.strategy';
import { UsersService } from '@/users/users.service';

describe('JwtAccessStrategy', () => {
  let strategy: JwtAccessStrategy;
  let usersService: jest.Mocked<UsersService>;

  beforeEach(async () => {
    const mockConfigService = {
      getOrThrow: jest.fn().mockReturnValue('mock_secret'),
    };

    const mockUsersService = {
      findOneById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtAccessStrategy,
        { provide: ConfigService, useValue: mockConfigService },
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile();

    strategy = module.get<JwtAccessStrategy>(JwtAccessStrategy);
    usersService = module.get(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return safe user without sensitive fields', async () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      password: 'hashed_password',
      twoFactorSecret: 'secret',
      recoveryCodes: ['code1'],
    };
    usersService.findOneById.mockResolvedValue(mockUser as any);

    const result = await strategy.validate({ userId: '1' });

    expect(usersService.findOneById).toHaveBeenCalledWith('1');
    expect(result).toEqual({ id: '1', email: 'test@example.com' });
    expect(result).not.toHaveProperty('password');
    expect(result).not.toHaveProperty('twoFactorSecret');
    expect(result).not.toHaveProperty('recoveryCodes');
  });

  it('should throw UnauthorizedException if user is not found', async () => {
    usersService.findOneById.mockResolvedValue(null);

    await expect(strategy.validate({ userId: '1' })).rejects.toThrow(UnauthorizedException);
  });
});
