import type { Response } from 'express';
type TCookieCarrier = Pick<Response, 'cookie' | 'clearCookie'>;
export declare const setTokenCookies: (
  res: TCookieCarrier,
  accessToken: string,
  refreshToken: string,
) => void;
export declare const clearTokenCookies: (res: TCookieCarrier) => void;
export {};
