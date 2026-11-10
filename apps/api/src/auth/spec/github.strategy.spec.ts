import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import type { Profile } from 'passport-github2';

jest.mock('otplib', () => ({
  generateSecret: jest.fn(),
  generateURI: jest.fn(),
  verify: jest.fn(),
}));
jest.mock('qrcode', () => ({ toDataURL: jest.fn() }));
jest.mock('argon2', () => ({ hash: jest.fn(), verify: jest.fn() }));

import { GithubStrategy } from '../strategies/github.strategy';

describe('GithubStrategy', () => {
  let strategy: GithubStrategy;

  beforeEach(async () => {
    const mockConfigService = {
      get: jest.fn().mockReturnValue('mock_value'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GithubStrategy,
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    strategy = module.get<GithubStrategy>(GithubStrategy);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should fetch primary email from GitHub API', async () => {
    const mockProfile = {
      displayName: 'John Doe',
      username: 'johndoe',
      photos: [{ value: 'http://photo.url' }],
      id: 'github_123',
    } as unknown as Profile;

    const mockFetch = jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue([
        { email: 'secondary@example.com', primary: false, verified: true },
        { email: 'primary@example.com', primary: true, verified: true },
      ]),
    } as unknown as Response);

    const done = jest.fn();
    await strategy.validate('access_token', 'refresh_token', mockProfile, done);

    expect(mockFetch).toHaveBeenCalledWith('https://api.github.com/user/emails', expect.any(Object));
    expect(done).toHaveBeenCalledWith(null, {
      email: 'primary@example.com',
      firstName: 'John',
      lastName: 'Doe',
      picture: 'http://photo.url',
      accessToken: 'access_token',
      refreshToken: 'refresh_token',
      providerId: 'github_123',
      provider: 'github',
    });
  });

  it('should fallback to placeholder email if API fails', async () => {
    const mockProfile = {
      username: 'johndoe',
      id: 'github_123',
    } as unknown as Profile;

    jest.spyOn(global, 'fetch').mockRejectedValue(new Error('Network error'));

    const done = jest.fn();
    await strategy.validate('access_token', 'refresh_token', mockProfile, done);

    expect(done).toHaveBeenCalledWith(null, expect.objectContaining({
      email: 'johndoe_github_123@github.placeholder',
    }));
  });
});