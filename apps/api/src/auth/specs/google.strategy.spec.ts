const mockGoogleOAuthConstructor = jest.fn();

jest.mock('passport-google-oauth20', () => {
  class MockGoogleOAuthStrategy {
    constructor(options: unknown, verify: unknown) {
      mockGoogleOAuthConstructor(options, verify);
    }
  }
  return {
    Strategy: MockGoogleOAuthStrategy,
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
import type { Profile } from 'passport-google-oauth20';
import { GoogleStrategy } from '../strategies/google.strategy';

describe('GoogleStrategy', () => {
  let strategy: GoogleStrategy;

  beforeEach(async () => {
    const mockConfigService = {
      get: jest.fn().mockReturnValue('mock_value'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [GoogleStrategy, { provide: ConfigService, useValue: mockConfigService }],
    }).compile();

    strategy = module.get<GoogleStrategy>(GoogleStrategy);
  });

  it('should map Google profile to TOauthUser correctly', async () => {
    const mockProfile = {
      name: { givenName: 'John', familyName: 'Doe' },
      emails: [{ value: 'john@example.com' }],
      photos: [{ value: 'http://photo.url' }],
      id: 'google_123',
    } as unknown as Profile;

    const done = jest.fn();
    await strategy.validate('access_token', 'refresh_token', mockProfile, done);

    expect(done).toHaveBeenCalledWith(null, {
      email: 'john@example.com',
      firstName: 'John',
      lastName: 'Doe',
      picture: 'http://photo.url',
      accessToken: 'access_token',
      refreshToken: 'refresh_token',
      providerId: 'google_123',
      provider: 'google',
    });
  });

  it('should handle missing optional fields gracefully', async () => {
    const mockProfile = { id: 'google_123' } as unknown as Profile;
    const done = jest.fn();

    await strategy.validate('access_token', 'refresh_token', mockProfile, done);

    expect(done).toHaveBeenCalledWith(null, {
      email: '',
      firstName: '',
      lastName: '',
      picture: '',
      accessToken: 'access_token',
      refreshToken: 'refresh_token',
      providerId: 'google_123',
      provider: 'google',
    });
  });

  describe('constructor', () => {
    it('should use empty strings as fallback when config variables are missing', () => {
      const emptyConfigService = {
        get: jest.fn().mockReturnValue(undefined),
      };

      mockGoogleOAuthConstructor.mockClear();

      new GoogleStrategy(emptyConfigService as unknown as ConfigService);

      expect(mockGoogleOAuthConstructor).toHaveBeenCalledWith(
        expect.objectContaining({
          clientID: '',
          clientSecret: '',
          callbackURL: '',
        }),
        expect.any(Function),
      );
      expect(emptyConfigService.get).toHaveBeenCalledWith('GOOGLE_CLIENT_ID');
      expect(emptyConfigService.get).toHaveBeenCalledWith('GOOGLE_CLIENT_SECRET');
      expect(emptyConfigService.get).toHaveBeenCalledWith('GOOGLE_CALLBACK_URL');
    });
  });
});
