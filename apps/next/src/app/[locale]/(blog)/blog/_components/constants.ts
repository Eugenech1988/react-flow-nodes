import type { ICategory } from './types';

const BLOG_PAGE_SIZE = 3;

const BLOG_CATEGORIES: ICategory[] = [
  { id: 'all', code: '01' },
  { id: 'engineering', code: '02' },
  { id: 'design', code: '03' },
  { id: 'research', code: '04' },
  { id: 'product', code: '05' },
];

export { BLOG_PAGE_SIZE, BLOG_CATEGORIES };
