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
    usersService = module.get(UsersService) as jest.Mocked<UsersService>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return safe user if found', async () => {
    const mockUser = createMockUser();
    usersService.findOneById.mockResolvedValue(mockUser);

    const result = await strategy.validate({ userId: '1' });

    expect(usersService.findOneById).toHaveBeenCalledWith('1');

    // 👇 Match only the fields the strategy is contractually required to return
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

  describe('jwtFromRequest extractor', () => {
    type ExtractorFn = (req: unknown) => string | null;

    const getExtractor = (): ExtractorFn => {
      const instance = strategy as unknown as { _jwtFromRequest: ExtractorFn };
      return instance._jwtFromRequest;
    };

    it('should return token when cookies.refreshToken is present', () => {
      const result = getExtractor()({ cookies: { refreshToken: 'token_abc' } });
      expect(result).toBe('token_abc');
    });

    it('should return null when cookies is empty', () => {
      const result = getExtractor()({ cookies: {} });
      expect(result).toBeNull();
    });

    it('should return null when cookies is missing', () => {
      const result = getExtractor()({});
      expect(result).toBeNull();
    });

    it('should return null when req is undefined', () => {
      const result = getExtractor()(undefined);
      expect(result).toBeNull();
    });
  });
});
