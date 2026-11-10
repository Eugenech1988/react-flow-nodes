import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const secret = req.headers.get('x-revalidate-secret');
  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  try {
    revalidateTag('jobs', 'default');
    console.log('✅ Cache tag "jobs" revalidated with default profile');
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
