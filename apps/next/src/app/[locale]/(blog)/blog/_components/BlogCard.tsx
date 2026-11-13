'use client';

import Link from 'next/link';
import { ArrowUpRight, Calendar, Clock } from 'lucide-react';
import { useT } from '@/shared/lib/i18n/client';
import { CATEGORY_ICONS, DEFAULT_CATEGORY_ICON } from '@/shared/lib/sanity';
import { IBlogPostPreview } from '.';

interface IBlogCardProps {
  post: IBlogPostPreview;
  locale: string;
}

export const BlogCard = ({ post, locale }: IBlogCardProps) => {
  const { t } = useT('blog');
  const Icon = CATEGORY_ICONS[post.category] ?? DEFAULT_CATEGORY_ICON;
  const entryId = post.id ? post.id.slice(0, 6).toUpperCase() : '------';

  return (
    <Link
      href={`/${locale}/blog/${post.slug}`}
      className="group border-theme-line bg-theme-surface/95 hover:border-theme-accent/60 hover:bg-theme-panel relative flex flex-col overflow-hidden rounded-sm border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.5),0_0_20px_color-mix(in_oklab,var(--theme-accent)_15%,transparent)]"
    >
      <span className="via-theme-accent/50 pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

      <div className="border-theme-line bg-theme-panel relative flex items-center justify-between border-b border-dashed px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="text-theme-dim font-mono text-[9px] font-bold tracking-widest">
            ENTRY.{entryId}
          </span>
          <span className="bg-theme-line h-1 w-1 rounded-full" />
          <span className="text-theme-accent font-mono text-[9px] font-bold tracking-widest uppercase">
            {t(`categories.${post.category}`)}
          </span>
        </div>
        <span className="text-theme-muted font-mono text-[9px] tracking-widest">
          <span className="text-theme-accent">●</span>
          {t('card.online')}
        </span>
      </div>

      <div className="relative flex flex-1 flex-col p-5 sm:p-6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,color-mix(in_oklab,var(--theme-accent)_6%,transparent),transparent_60%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        <div className="relative flex items-start gap-4">
          <div className="border-theme-accent/30 bg-theme-panel text-theme-accent group-hover:border-theme-accent-hover/60 group-hover:bg-theme-accent/10 group-hover:text-theme-accent-hover flex h-11 w-11 shrink-0 items-center justify-center rounded-sm border transition-all duration-300">
            <Icon className="h-5 w-5" />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-theme-fg group-hover:text-theme-accent-hover line-clamp-2 text-lg leading-snug font-bold transition-colors sm:text-xl">
              {post.title}
            </h3>
          </div>
        </div>

        <p className="text-theme-muted relative mt-4 line-clamp-3 text-sm leading-relaxed">
          {post.excerpt}
        </p>

        <div className="border-theme-line relative mt-auto flex items-center justify-between border-t border-dashed pt-4">
          <div className="text-theme-dim flex items-center gap-3 font-mono text-[9px] tracking-widest uppercase">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-2.5 w-2.5" />
              {post.date}
            </span>
            <span className="bg-theme-line h-1 w-1 rounded-full" />
            <span className="flex items-center gap-1.5">
              <Clock className="h-2.5 w-2.5" />
              T-{String(post.readTime).padStart(2, '0')}
            </span>
          </div>

          <span className="border-theme-line bg-theme-panel text-theme-accent group-hover:border-theme-accent-hover/60 group-hover:bg-theme-accent/10 group-hover:text-theme-accent-hover flex h-7 w-7 items-center justify-center rounded-sm border transition-all">
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
};
