import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, x-revalidate-secret',
    },
  });
}

export async function POST(req: Request) {
  const secret = req.headers.get('x-revalidate-secret');

  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json(
      { ok: false, message: 'Unauthorized' },
      {
        status: 401,
        headers: { 'Access-Control-Allow-Origin': '*' }
      }
    );
  }

  try {
    revalidateTag('jobs', 'max');
    console.log('✅ [Next.js] Cache tag "jobs" successfully revalidated');

    return NextResponse.json(
      { ok: true, now: Date.now() },
      { headers: { 'Access-Control-Allow-Origin': '*' } }
    );
  } catch (error) {
    console.error('❌ [Next.js] Revalidation failed:', error);
    return NextResponse.json(
      { ok: false, message: 'Revalidation failed' },
      {
        status: 500,
        headers: { 'Access-Control-Allow-Origin': '*' }
      }
    );
  }
}