'use client';

import { Calendar, Clock, User, Hash } from 'lucide-react';
import { Badge } from '@/shared/ui';
import { useT } from '@/shared/lib/i18n/client';
import type { IBlogPostData } from '../../_components/constants';

interface IBlogPostHeaderProps {
  post: IBlogPostData;
}

export const BlogPostHeader = ({ post }: IBlogPostHeaderProps) => {
  const { t } = useT('blog');

  return (
    <div className="mb-10">
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Badge variant="hex" theme="blog">
          {t(`categories.${post.category}`)}
        </Badge>
        <span className="text-theme-dim flex items-center gap-1.5 font-mono text-[10px] tracking-widest uppercase">
          <Hash className="h-3 w-3" />
          {t('details.ref', { defaultValue: 'REF: ENTRY-{{id}}', id: post.id })}
        </span>
      </div>

      <h1 className="font-typewriter text-theme-fg mb-6 text-2xl leading-tight font-bold tracking-tight break-words uppercase sm:text-4xl md:text-5xl">
        {t(`posts.${post.slug}.title`)}
      </h1>

      <div className="border-theme-line text-theme-muted mb-8 flex flex-wrap items-center gap-x-4 gap-y-2 border-y border-dashed py-4 font-mono text-[10px] tracking-widest uppercase sm:text-xs">
        <span className="flex items-center gap-1.5">
          <Calendar className="text-theme-accent h-3.5 w-3.5" />
          {post.date}
        </span>
        <span className="text-theme-dim hidden sm:inline">/</span>
        <span className="flex items-center gap-1.5">
          <Clock className="text-theme-accent h-3.5 w-3.5" />
          T-{String(post.readTime).padStart(2, '0')}
        </span>
        <span className="text-theme-dim hidden sm:inline">/</span>
        <span className="flex items-center gap-1.5">
          <User className="text-theme-accent h-3.5 w-3.5" />
          OPR: {post.author.toUpperCase()}
        </span>
      </div>
    </div>
  );
};
