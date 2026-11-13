import type { PortableTextBlock } from '@portabletext/react';
import type { SanityImageSource } from '@/shared/lib/sanity/client';
import type { IBlogPostBase } from '@/shared/lib/sanity/types';

interface IBlogPostDetail extends IBlogPostBase {
  body: PortableTextBlock[];
  mainImage?: SanityImageSource;
}

export type { IBlogPostDetail };
