import type { Metadata } from 'next';
import { getPageMetadata } from '@/shared/lib/seo/metadata';
import { ContactsBackground, ContactsHero, ContactsContent } from './_components';

type TPageProps = {
  params: Promise<{ locale: string }>;
};

export const generateMetadata = async ({ params }: TPageProps): Promise<Metadata> => {
  const { locale } = await params;
  return getPageMetadata(locale, 'contacts', '/contacts');
};

const ContactsPage = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#040a09] text-[#d1faf5]">
      <ContactsBackground />
      <ContactsHero />
      <ContactsContent />
    </div>
  );
};

export default ContactsPage;
