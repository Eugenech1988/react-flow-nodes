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

import { JwtRefreshStrategy } from '../strategies/jwt-refresh.strategy';
import { UsersService } from '@/users/users.service';

describe('JwtRefreshStrategy', () => {
  let strategy: JwtRefreshStrategy;
  let usersService: jest.Mocked<UsersService>;

  beforeEach(async () => {
    const mockConfigService = {
      getOrThrow: jest.fn().mockReturnValue('mock_refresh_secret'),
    };

    const mockUsersService = {
      findOneById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtRefreshStrategy,
        { provide: ConfigService, useValue: mockConfigService },
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile();

    strategy = module.get<JwtRefreshStrategy>(JwtRefreshStrategy);
    usersService = module.get(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return safe user if found', async () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      password: 'hashed_password',
    };
    usersService.findOneById.mockResolvedValue(mockUser as any);

    const result = await strategy.validate({ userId: '1' });

    expect(usersService.findOneById).toHaveBeenCalledWith('1');
    expect(result).toEqual({ id: '1', email: 'test@example.com' });
    expect(result).not.toHaveProperty('password');
  });

  it('should throw UnauthorizedException if user is not found', async () => {
    usersService.findOneById.mockResolvedValue(null);

    await expect(strategy.validate({ userId: '1' })).rejects.toThrow(UnauthorizedException);
  });
});