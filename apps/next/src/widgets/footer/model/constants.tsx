import { CircleUserRound, X } from 'lucide-react';
import type { TFooterColumn } from '@/widgets/footer/model/types';

export const SOCIALS = [
  { icon: CircleUserRound, href: 'https://github.com' },
  { icon: X, href: 'https://twitter.com' },
];

export const FOOTER_COLUMNS: TFooterColumn[] = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '#' },
      { label: 'Use Cases', href: '#' },
      { label: 'How It Works', href: '#' },
      { label: 'Pricing', href: '#' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Documentation', href: '#' },
      { label: 'API Reference', href: '#' },
      { label: 'Guides', href: '#' },
      { label: 'System Status', href: '#' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '#' },
      { label: 'Blog', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Contact', href: '#' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Service', href: '#' },
      { label: 'Security', href: '#' },
    ],
  },
];