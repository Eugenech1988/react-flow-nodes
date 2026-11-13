import type { TNavLink } from './types';

export const NAV_LINKS: TNavLink[] = [
  { id: 'about', href: '/about' },
  { id: 'blog', href: '/blog' },
  { id: 'careers', href: '/careers' },
  { id: 'contacts', href: '/contacts' },
] as const;
