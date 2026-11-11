import type { TFooterColumn } from './types';

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
      { id: 'blog', href: `/${lng}/blog` },
      { id: 'careers', href: `/${lng}/careers` },
      { id: 'contact', href: `/${lng}/contacts` },
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
