import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

const DEV_ORIGIN = process.env.NODE_ENV !== 'production' ? 'http://localhost:5173' : null;

const ALLOWED_ORIGINS = [DEV_ORIGIN, process.env.ADMIN_APP_URL].filter(Boolean) as string[];

const buildCorsHeaders = (origin: string | null): Record<string, string> => {
  const headers: Record<string, string> = {
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-revalidate-secret',
    'Access-Control-Max-Age': '86400',
  };
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers['Vary'] = 'Origin';
  }
  return headers;
};

export const OPTIONS = (req: Request) => {
  const origin = req.headers.get('origin');
  return new NextResponse(null, { status: 204, headers: buildCorsHeaders(origin) });
};

export const POST = async (req: Request) => {
  const origin = req.headers.get('origin');
  const cors = buildCorsHeaders(origin);
  const secret = req.headers.get('x-revalidate-secret');

  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ ok: false }, { status: 401, headers: cors });
  }

  try {
    const body = (await req.json().catch(() => ({}))) as { tags?: string[] };
    const tags = Array.isArray(body.tags) && body.tags.length > 0 ? body.tags : ['jobs'];

    for (const tag of tags) {
      revalidateTag(tag, 'max');
    }

    return NextResponse.json({ ok: true, tags }, { headers: cors });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500, headers: cors });
  }
};
