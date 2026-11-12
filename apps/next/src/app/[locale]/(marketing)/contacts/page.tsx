import type { Metadata } from 'next';
import type { TPageProps } from '@/shared/lib';
import { getPageMetadata } from '@/shared/lib/seo/metadata';
import { ContactsBackground, ContactsHero, ContactsContent } from './_components';

export const generateMetadata = async ({ params }: TPageProps): Promise<Metadata> => {
  const { locale } = await params;
  return getPageMetadata(locale, 'contacts', '/contacts');
};

const ContactsPage = () => (
  <div className="bg-theme-bg text-theme-fg relative min-h-screen overflow-hidden">
    <ContactsBackground />
    <ContactsHero />
    <ContactsContent />
  </div>
);

export default ContactsPage;
