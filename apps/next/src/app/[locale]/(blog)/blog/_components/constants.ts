import { Code2, Palette, FlaskConical, Rocket, FileCode, type LucideIcon } from 'lucide-react';

export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  engineering: Code2,
  design: Palette,
  research: FlaskConical,
  product: Rocket,
};

export const BLOG_PAGE_SIZE = 3;

export const DEFAULT_CATEGORY_ICON = FileCode;

export const BLOG_CATEGORIES = [
  { id: 'all', code: '01' },
  { id: 'engineering', code: '02' },
  { id: 'design', code: '03' },
  { id: 'research', code: '04' },
  { id: 'product', code: '05' },
];

export interface IBlogPostData {
  id: string;
  slug: string;
  category: string;
  date: string;
  readTime: number;
  author: string;
  featured?: boolean;
}

export const BLOG_POSTS: IBlogPostData[] = [
  {
    id: '001',
    slug: 'declarative-pipeline-as-code',
    category: 'engineering',
    date: '2026.10.14',
    readTime: 8,
    author: 'eugene',
    featured: true,
  },
  {
    id: '002',
    slug: 'designing-for-speed',
    category: 'design',
    date: '2026.10.02',
    readTime: 6,
    author: 'jane',
  },
  {
    id: '003',
    slug: 'the-future-of-ai-infra',
    category: 'research',
    date: '2026.09.21',
    readTime: 12,
    author: 'marcus',
  },
  {
    id: '004',
    slug: 'ship-fast-ship-safe',
    category: 'engineering',
    date: '2026.09.08',
    readTime: 5,
    author: 'elena',
  },
  {
    id: '005',
    slug: 'product-velocity-metrics',
    category: 'product',
    date: '2026.08.30',
    readTime: 7,
    author: 'viktor',
  },
  {
    id: '006',
    slug: 'visual-hierarchy-in-terminal-ui',
    category: 'design',
    date: '2026.08.15',
    readTime: 9,
    author: 'sarah',
  },
];
