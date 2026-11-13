import type { SanityImageSource } from '@/shared/lib/sanity/client';

type TBlogCategory = 'engineering' | 'design' | 'research' | 'product';

interface IBlogPostBase {
  id: string | null;
  slug: string;
  title: string;
  excerpt: string;
  category: TBlogCategory;
  author: string;
  date: string;
  readTime: number;
  featured?: boolean;
}

interface ILinkMark {
  _type: 'link';
  href: string;
  blank?: boolean;
}

interface IImageBlockValue {
  _type: 'image';
  asset?: SanityImageSource;
  alt?: string;
  caption?: string;
}

interface ICodeBlockValue {
  _type: 'code';
  language?: string;
  code?: string;
}

interface IDividerBlockValue {
  _type: 'divider';
  style?: string;
}

export type {
  TBlogCategory,
  IBlogPostBase,
  ILinkMark,
  IImageBlockValue,
  ICodeBlockValue,
  IDividerBlockValue,
};
