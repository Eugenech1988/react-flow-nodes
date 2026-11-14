import type { Response } from 'express';

type TCookieCarrier = Pick<Response, 'cookie' | 'clearCookie'>;

interface ICookieOptions {
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'lax' | 'strict' | 'none';
}

const ACCESS_TOKEN_MAX_AGE_MS = 15 * 60 * 1000;
const REFRESH_TOKEN_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

const buildBaseOptions = (): ICookieOptions => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
});

export const setTokenCookies = (
  res: TCookieCarrier,
  accessToken: string,
  refreshToken: string,
): void => {
  const base = buildBaseOptions();
  res.cookie('accessToken', accessToken, { ...base, maxAge: ACCESS_TOKEN_MAX_AGE_MS });
  res.cookie('refreshToken', refreshToken, { ...base, maxAge: REFRESH_TOKEN_MAX_AGE_MS });
};

export const clearTokenCookies = (res: TCookieCarrier): void => {
  const base = buildBaseOptions();
  res.clearCookie('accessToken', base);
  res.clearCookie('refreshToken', base);
};
