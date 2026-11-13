import type { IBlogPostBase, TBlogCategory } from '@/shared/lib/sanity/types';

interface IBlogPostPreview extends IBlogPostBase {}

type TCategoryId = 'all' | TBlogCategory;

interface ICategory {
  id: TCategoryId;
  code: string;
}

export type { IBlogPostPreview, TCategoryId, ICategory };
