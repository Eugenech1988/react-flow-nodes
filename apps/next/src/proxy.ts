import { NextResponse, type NextRequest } from 'next/server';
import { createProxy } from 'next-i18next/proxy';
import i18nConfig from '@/shared/lib/i18n/config';

const intlProxy = createProxy(i18nConfig);

const ALLOWED_ORIGINS = ['http://localhost:5173', process.env.ADMIN_APP_URL].filter(
  Boolean,
) as string[];

const corsOptions = {
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-revalidate-secret',
  'Access-Control-Max-Age': '86400',
};

export const proxy = (request: NextRequest) => {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/api/revalidate')) {
    const origin = request.headers.get('origin') ?? '';
    const isAllowed = ALLOWED_ORIGINS.includes(origin);

    const corsHeaders = new Headers(corsOptions);

    if (isAllowed) {
      corsHeaders.set('Access-Control-Allow-Origin', origin);
      corsHeaders.set('Vary', 'Origin');
    }

    if (request.method === 'OPTIONS') {
      return new NextResponse(null, { status: 204, headers: corsHeaders });
    }

    const response = NextResponse.next();
    corsHeaders.forEach((value, key) => {
      response.headers.set(key, value);
    });
    return response;
  }

  return intlProxy(request);
};

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)'],
};
