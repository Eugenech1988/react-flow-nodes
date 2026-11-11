const DEV_FALLBACK = process.env.NODE_ENV === 'development' ? 'http://localhost:5173' : '';

export const APP_URL = (process.env.NEXT_PUBLIC_APP_URL ?? DEV_FALLBACK).replace(/\/$/, '');
export const APP_LOGIN_URL = `${APP_URL}/login`;
