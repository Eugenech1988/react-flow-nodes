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
import { UsersService, type UserWithRelations } from '@/users/users.service';

const createMockUser = (overrides: Partial<UserWithRelations> = {}): UserWithRelations =>
  ({
    id: '1',
    email: 'test@example.com',
    password: 'hashed_password',
    hasPassword: true,
    role: 'USER',
    provider: 'local',
    providerId: '1',
    isTwoFactorEnabled: false,
    twoFactorSecret: 'secret',
    recoveryCodes: ['code1'],
    currentPipelineId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    profile: null,
    subscription: null,
    currentPipeline: null,
    ...overrides,
  }) as unknown as UserWithRelations;

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
    usersService = module.get(UsersService) as jest.Mocked<UsersService>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return safe user without sensitive fields', async () => {
    const mockUser = createMockUser();
    usersService.findOneById.mockResolvedValue(mockUser);

    const result = await strategy.validate({ userId: '1' });

    expect(usersService.findOneById).toHaveBeenCalledWith('1');

    expect(result).toMatchObject({
      id: '1',
      email: 'test@example.com',
      role: 'USER',
    });

    expect(result).not.toHaveProperty('password');
    expect(result).not.toHaveProperty('twoFactorSecret');
    expect(result).not.toHaveProperty('recoveryCodes');
  });

  it('should throw UnauthorizedException if user is not found', async () => {
    usersService.findOneById.mockResolvedValue(null);

    await expect(strategy.validate({ userId: '1' })).rejects.toThrow(UnauthorizedException);
  });
});
