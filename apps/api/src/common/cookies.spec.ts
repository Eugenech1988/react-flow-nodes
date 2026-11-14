import { setTokenCookies, clearTokenCookies } from './cookies';

interface ICookieCarrierMock {
  cookie: jest.Mock;
  clearCookie: jest.Mock;
}

const createCarrier = (): ICookieCarrierMock => ({
  cookie: jest.fn(),
  clearCookie: jest.fn(),
});

describe('cookies', () => {
  const originalEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
    jest.clearAllMocks();
  });

  describe('setTokenCookies', () => {
    it('sets accessToken with 15min maxAge and httpOnly', () => {
      const res = createCarrier();
      setTokenCookies(res, 'access', 'refresh');
      expect(res.cookie).toHaveBeenCalledWith(
        'accessToken',
        'access',
        expect.objectContaining({
          httpOnly: true,
          sameSite: 'lax',
          maxAge: 15 * 60 * 1000,
        }),
      );
    });

    it('sets refreshToken with 7d maxAge', () => {
      const res = createCarrier();
      setTokenCookies(res, 'access', 'refresh');
      expect(res.cookie).toHaveBeenCalledWith(
        'refreshToken',
        'refresh',
        expect.objectContaining({
          httpOnly: true,
          sameSite: 'lax',
          maxAge: 7 * 24 * 60 * 60 * 1000,
        }),
      );
    });

    it('sets secure=true in production', () => {
      process.env.NODE_ENV = 'production';
      const res = createCarrier();
      setTokenCookies(res, 'a', 'r');
      expect(res.cookie).toHaveBeenCalledWith(
        'accessToken',
        'a',
        expect.objectContaining({ secure: true }),
      );
    });

    it('sets secure=false in dev', () => {
      process.env.NODE_ENV = 'development';
      const res = createCarrier();
      setTokenCookies(res, 'a', 'r');
      expect(res.cookie).toHaveBeenCalledWith(
        'accessToken',
        'a',
        expect.objectContaining({ secure: false }),
      );
    });
  });

  describe('clearTokenCookies', () => {
    it('clears both access and refresh tokens with same options', () => {
      const res = createCarrier();
      clearTokenCookies(res);
      expect(res.clearCookie).toHaveBeenCalledWith(
        'accessToken',
        expect.objectContaining({ httpOnly: true, sameSite: 'lax' }),
      );
      expect(res.clearCookie).toHaveBeenCalledWith(
        'refreshToken',
        expect.objectContaining({ httpOnly: true, sameSite: 'lax' }),
      );
    });

    it('does not include maxAge in clear options', () => {
      const res = createCarrier();
      clearTokenCookies(res);
      const firstCall = res.clearCookie.mock.calls[0][1];
      expect(firstCall).not.toHaveProperty('maxAge');
    });
  });
});
