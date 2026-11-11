const mockGithubOAuthConstructor = jest.fn();

jest.mock('passport-github2', () => {
  class MockGithubStrategy {
    constructor(options: unknown, verify: unknown) {
      mockGithubOAuthConstructor(options, verify);
    }
  }
  return {
    Strategy: MockGithubStrategy,
  };
});

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

import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import type { Profile } from 'passport-github2';
import { GithubStrategy } from '../strategies/github.strategy';

describe('GithubStrategy', () => {
  let strategy: GithubStrategy;

  const baseProfile = {
    displayName: 'John Doe',
    username: 'johndoe',
    photos: [{ value: 'http://photo.url' }],
    id: 'github_123',
  } as unknown as Profile;

  beforeEach(async () => {
    const mockConfigService = {
      get: jest.fn().mockReturnValue('mock_value'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [GithubStrategy, { provide: ConfigService, useValue: mockConfigService }],
    }).compile();

    strategy = module.get<GithubStrategy>(GithubStrategy);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    mockGithubOAuthConstructor.mockClear();
  });

  describe('constructor', () => {
    it('should use empty strings as fallback when config variables are missing', () => {
      const emptyConfigService = {
        get: jest.fn().mockReturnValue(undefined),
      };

      new GithubStrategy(emptyConfigService as unknown as ConfigService);

      expect(mockGithubOAuthConstructor).toHaveBeenCalledWith(
        expect.objectContaining({
          clientID: '',
          clientSecret: '',
          callbackURL: '',
        }),
        expect.any(Function),
      );
    });
  });

  describe('validate - email resolution', () => {
    it('should use primary email when available', async () => {
      jest.spyOn(global, 'fetch').mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue([
          { email: 'secondary@example.com', primary: false, verified: true },
          { email: 'primary@example.com', primary: true, verified: true },
        ]),
      } as unknown as Response);

      const done = jest.fn();
      await strategy.validate('token', 'refresh', baseProfile, done);

      expect(done).toHaveBeenCalledWith(
        null,
        expect.objectContaining({ email: 'primary@example.com' }),
      );
    });

    it('should fallback to verified email when primary is missing', async () => {
      jest.spyOn(global, 'fetch').mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue([
          { email: 'secondary@example.com', primary: false, verified: false },
          { email: 'verified@example.com', primary: false, verified: true },
        ]),
      } as unknown as Response);

      const done = jest.fn();
      await strategy.validate('token', 'refresh', baseProfile, done);

      expect(done).toHaveBeenCalledWith(
        null,
        expect.objectContaining({ email: 'verified@example.com' }),
      );
    });

    it('should fallback to verified email when primary email is empty string', async () => {
      jest.spyOn(global, 'fetch').mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue([
          { email: '', primary: true, verified: false },
          { email: 'verified@example.com', primary: false, verified: true },
        ]),
      } as unknown as Response);

      const done = jest.fn();
      await strategy.validate('token', 'refresh', baseProfile, done);

      expect(done).toHaveBeenCalledWith(
        null,
        expect.objectContaining({ email: 'verified@example.com' }),
      );
    });

    it('should fallback to first email when neither primary nor verified flags exist', async () => {
      jest.spyOn(global, 'fetch').mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue([
          { email: 'fallback@example.com', primary: false, verified: false },
          { email: 'another@example.com', primary: false, verified: false },
        ]),
      } as unknown as Response);

      const done = jest.fn();
      await strategy.validate('token', 'refresh', baseProfile, done);

      expect(done).toHaveBeenCalledWith(
        null,
        expect.objectContaining({ email: 'fallback@example.com' }),
      );
    });

    it('should use placeholder email when API returns empty array', async () => {
      jest.spyOn(global, 'fetch').mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue([]),
      } as unknown as Response);

      const done = jest.fn();
      await strategy.validate('token', 'refresh', baseProfile, done);

      expect(done).toHaveBeenCalledWith(
        null,
        expect.objectContaining({ email: 'johndoe_github_123@github.placeholder' }),
      );
    });

    it('should use placeholder email when response.ok is false', async () => {
      jest.spyOn(global, 'fetch').mockResolvedValue({
        ok: false,
        json: jest.fn(),
      } as unknown as Response);

      const done = jest.fn();
      await strategy.validate('token', 'refresh', baseProfile, done);

      expect(done).toHaveBeenCalledWith(
        null,
        expect.objectContaining({ email: 'johndoe_github_123@github.placeholder' }),
      );
    });

    it('should use placeholder email when fetch throws', async () => {
      jest.spyOn(global, 'fetch').mockRejectedValue(new Error('Network error'));

      const done = jest.fn();
      await strategy.validate('token', 'refresh', baseProfile, done);

      expect(done).toHaveBeenCalledWith(
        null,
        expect.objectContaining({ email: 'johndoe_github_123@github.placeholder' }),
      );
    });

    it('should use "unknown" prefix when username is missing', async () => {
      jest.spyOn(global, 'fetch').mockResolvedValue({
        ok: false,
        json: jest.fn(),
      } as unknown as Response);

      const profileWithoutUsername = {
        displayName: 'John Doe',
        username: undefined,
        photos: [],
        id: 'gh_999',
      } as unknown as Profile;

      const done = jest.fn();
      await strategy.validate('token', 'refresh', profileWithoutUsername, done);

      expect(done).toHaveBeenCalledWith(
        null,
        expect.objectContaining({ email: 'unknown_gh_999@github.placeholder' }),
      );
    });
  });

  describe('validate - name resolution', () => {
    beforeEach(() => {
      jest.spyOn(global, 'fetch').mockResolvedValue({
        ok: false,
        json: jest.fn(),
      } as unknown as Response);
    });

    it('should split displayName into firstName and lastName', async () => {
      const done = jest.fn();
      await strategy.validate('token', 'refresh', baseProfile, done);

      expect(done).toHaveBeenCalledWith(
        null,
        expect.objectContaining({ firstName: 'John', lastName: 'Doe' }),
      );
    });

    it('should use username as firstName when displayName is missing', async () => {
      const profileNoName = {
        displayName: undefined,
        username: 'onlyuser',
        photos: [],
        id: 'gh_111',
      } as unknown as Profile;

      const done = jest.fn();
      await strategy.validate('token', 'refresh', profileNoName, done);

      expect(done).toHaveBeenCalledWith(
        null,
        expect.objectContaining({ firstName: 'onlyuser', lastName: '' }),
      );
    });

    it('should set empty strings when displayName and username are both missing', async () => {
      const profileMinimal = {
        displayName: undefined,
        username: undefined,
        photos: undefined,
        id: 'gh_000',
      } as unknown as Profile;

      const done = jest.fn();
      await strategy.validate('token', 'refresh', profileMinimal, done);

      expect(done).toHaveBeenCalledWith(
        null,
        expect.objectContaining({
          firstName: '',
          lastName: '',
          picture: '',
        }),
      );
    });

    it('should use empty string for picture when photos array is empty', async () => {
      const profileEmptyPhotos = {
        displayName: 'Jane Doe',
        username: 'janedoe',
        photos: [],
        id: 'gh_222',
      } as unknown as Profile;

      const done = jest.fn();
      await strategy.validate('token', 'refresh', profileEmptyPhotos, done);

      expect(done).toHaveBeenCalledWith(null, expect.objectContaining({ picture: '' }));
    });
  });
});
