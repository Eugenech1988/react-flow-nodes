import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';

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

import { LocalStrategy } from '../strategies/local.strategy';
import { AuthService } from '@/auth/auth.service';

describe('LocalStrategy', () => {
  let strategy: LocalStrategy;
  let authService: jest.Mocked<AuthService>;

  beforeEach(async () => {
    const mockAuthService = {
      validateUser: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [LocalStrategy, { provide: AuthService, useValue: mockAuthService }],
    }).compile();

    strategy = module.get<LocalStrategy>(LocalStrategy);
    authService = module.get(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return user if validation is successful', async () => {
    const mockUser = { id: '1', email: 'test@example.com' } as any;
    authService.validateUser.mockResolvedValue(mockUser);

    const result = await strategy.validate('test@example.com', 'password123');

    expect(authService.validateUser).toHaveBeenCalledWith('test@example.com', 'password123');
    expect(result).toEqual(mockUser);
  });

  it('should throw UnauthorizedException if validation fails', async () => {
    authService.validateUser.mockResolvedValue(null);

    await expect(strategy.validate('test@example.com', 'wrong')).rejects.toThrow(
      UnauthorizedException,
    );

    expect(authService.validateUser).toHaveBeenCalledWith('test@example.com', 'wrong');
  });
});
