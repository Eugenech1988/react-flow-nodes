'use client';

import Link from 'next/link';
import { ArrowUpRight, Calendar, Clock } from 'lucide-react';
import { useT } from '@/shared/lib/i18n/client';
import { CATEGORY_ICONS, DEFAULT_CATEGORY_ICON } from './constants';

interface IBlogCardProps {
  id: string;
  slug: string;
  category: string;
  date: string;
  readTime: number;
  locale: string;
}

export const BlogCard = ({ id, slug, category, date, readTime, locale }: IBlogCardProps) => {
  const { t } = useT('blog');
  const Icon = CATEGORY_ICONS[category] ?? DEFAULT_CATEGORY_ICON;

  return (
    <Link
      href={`/${locale}/blog/${slug}`}
      className="group relative flex flex-col overflow-hidden rounded-sm border border-blog-border bg-blog-surface/95 transition-all duration-300 hover:-translate-y-0.5 hover:border-blog-accent/60 hover:bg-blog-panel hover:shadow-[0_8px_24px_rgba(0,0,0,0.5),0_0_20px_rgba(45,212,191,0.15)]"
    >
      <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-blog-accent/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

      <div className="relative flex items-center justify-between border-b border-dashed border-blog-border bg-blog-panel px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[9px] font-bold tracking-widest text-blog-dim">
            ENTRY.{id}
          </span>
          <span className="h-1 w-1 rounded-full bg-blog-border" />
          <span className="font-mono text-[9px] font-bold tracking-widest text-blog-accent uppercase">
            {t(`categories.${category}`)}
          </span>
        </div>
        <span className="font-mono text-[9px] tracking-widest text-blog-muted">
          <span className="text-blog-accent">●</span>{t('card.online')}
        </span>
      </div>

      <div className="relative flex flex-1 flex-col p-5 sm:p-6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--color-blog-accent)/0.06,transparent_60%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        <div className="relative flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm border border-blog-accent/30 bg-blog-panel text-blog-accent transition-all duration-300 group-hover:border-blog-accent-hover/60 group-hover:bg-blog-accent/10 group-hover:text-blog-accent-hover">
            <Icon className="h-5 w-5" />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="line-clamp-2 text-lg leading-snug font-bold text-blog-text transition-colors group-hover:text-blog-accent-hover sm:text-xl">
              {t(`posts.${slug}.title`)}
            </h3>
          </div>
        </div>

        <p className="relative mt-4 line-clamp-3 text-sm leading-relaxed text-blog-muted">
          {t(`posts.${slug}.excerpt`)}
        </p>

        <div className="relative mt-auto flex items-center justify-between border-t border-dashed border-blog-border pt-4">
          <div className="flex items-center gap-3 font-mono text-[9px] tracking-widest text-blog-dim uppercase">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-2.5 w-2.5" />
              {date}
            </span>
            <span className="h-1 w-1 rounded-full bg-blog-border" />
            <span className="flex items-center gap-1.5">
              <Clock className="h-2.5 w-2.5" />
              T-{String(readTime).padStart(2, '0')}
            </span>
          </div>

          <span className="flex h-7 w-7 items-center justify-center rounded-sm border border-blog-border bg-blog-panel text-blog-accent transition-all group-hover:border-blog-accent-hover/60 group-hover:bg-blog-accent/10 group-hover:text-blog-accent-hover">
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
};