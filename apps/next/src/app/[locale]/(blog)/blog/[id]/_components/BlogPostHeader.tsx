'use client';

import Image from 'next/image';
import { Calendar, Clock, User, Hash } from 'lucide-react';
import { Badge } from '@/shared/ui';
import { useT } from '@/shared/lib/i18n/client';
import { urlFor } from '@/shared/lib/sanity';
import { IBlogPostDetail } from '.';

interface IBlogPostHeaderProps {
  post: IBlogPostDetail;
}

export const BlogPostHeader = ({ post }: IBlogPostHeaderProps) => {
  const { t } = useT('blog');
  const entryId = post.id ? post.id.slice(0, 6).toUpperCase() : '------';
  const readTime = post.readTime ? String(post.readTime).padStart(2, '0') : '00';

  return (
    <div className="mb-10">
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Badge variant="hex" theme="blog">
          {t(`categories.${post.category}`)}
        </Badge>
        <span className="text-theme-dim flex items-center gap-1.5 font-mono text-[10px] tracking-widest uppercase">
          <Hash className="h-3 w-3" />
          REF: ENTRY-{entryId}
        </span>
      </div>

      <h1 className="font-typewriter text-theme-fg mb-6 text-2xl leading-tight font-bold tracking-tight break-words uppercase sm:text-4xl md:text-5xl">
        {post.title}
      </h1>

      <div className="border-theme-line text-theme-muted mb-8 flex flex-wrap items-center gap-x-4 gap-y-2 border-y border-dashed py-4 font-mono text-[10px] tracking-widest uppercase sm:text-xs">
        <span className="flex items-center gap-1.5">
          <Calendar className="text-theme-accent h-3.5 w-3.5" />
          {post.date}
        </span>
        <span className="text-theme-dim hidden sm:inline">/</span>
        <span className="flex items-center gap-1.5">
          <Clock className="text-theme-accent h-3.5 w-3.5" />
          T-{readTime}
        </span>
        <span className="text-theme-dim hidden sm:inline">/</span>
        <span className="flex items-center gap-1.5">
          <User className="text-theme-accent h-3.5 w-3.5" />
          OPR: {post.author.toUpperCase()}
        </span>
      </div>

      {post.mainImage && (
        <div className="border-theme-line relative my-8 aspect-video w-full overflow-hidden rounded-sm border shadow-[0_0_20px_color-mix(in_oklab,var(--theme-accent)_10%,transparent)]">
          <Image
            src={urlFor(post.mainImage).width(1200).height(675).fit('crop').url()}
            alt={post.title}
            fill
            priority
            className="object-cover"
          />
          <div className="pointer-events-none absolute inset-0 border border-white/5" />
        </div>
      )}
    </div>
  );
};
