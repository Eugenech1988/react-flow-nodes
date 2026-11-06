import { headers } from 'next/headers';
import { NotFoundClient } from './not-found-client';

export default async function NotFound() {
  const headersList = await headers();
  const referer = headersList.get('referer') || '';
  const match = referer.match(/\/(en|ua)(\/|$)/);
  const locale = match ? match[1] : 'en';

  return <NotFoundClient locale={locale} />;
}