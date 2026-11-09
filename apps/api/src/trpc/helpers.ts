import type { Response } from 'express';

export function setTokenCookies(
  res: Pick<Response, 'cookie'>,
  accessToken: string,
  refreshToken: string,
) {
  const secure = process.env.NODE_ENV === 'production';
  const baseOptions = { httpOnly: true, secure, sameSite: 'lax' as const };

  res.cookie('accessToken', accessToken, { ...baseOptions, maxAge: 15 * 60 * 1000 });
  res.cookie('refreshToken', refreshToken, { ...baseOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });
}
