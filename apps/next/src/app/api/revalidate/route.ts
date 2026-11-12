import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

export const POST = async (req: Request) => {
  const secret = req.headers.get('x-revalidate-secret');
  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  try {
    revalidateTag('jobs', 'max');
    console.log('Cache tag "jobs" revalidated');
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
};
