import { CircleUserRound, X, type LucideIcon } from 'lucide-react';
import type { TFooterColumn, TSocial } from './types';

export const SOCIALS: (TSocial & { icon: LucideIcon })[] = [
  { id: 'github', icon: CircleUserRound, href: 'https://github.com' },
  { id: 'twitter', icon: X, href: 'https://twitter.com' },
];

export const getFooterColumns = (lng: string): TFooterColumn[] => [
  {
    id: 'product',
    links: [
      { id: 'features', href: `/${lng}#features` },
      { id: 'useCases', href: `/${lng}#use-cases` },
      { id: 'howItWorks', href: `/${lng}#how-it-works` },
      { id: 'pricing', href: `/${lng}#pricing` },
    ],
  },
  {
    id: 'resources',
    links: [
      { id: 'documentation', href: '#' },
      { id: 'apiReference', href: '#' },
      { id: 'guides', href: '#' },
      { id: 'systemStatus', href: '#' },
    ],
  },
  {
    id: 'company',
    links: [
      { id: 'about', href: `/${lng}/about` },
      { id: 'blog', href: '#' },
      { id: 'careers', href: `/${lng}/careers` },
      { id: 'contact', href: '#' },
    ],
  },
  {
    id: 'legal',
    links: [
      { id: 'privacy', href: '#' },
      { id: 'terms', href: '#' },
      { id: 'security', href: '#' },
    ],
  },
];
