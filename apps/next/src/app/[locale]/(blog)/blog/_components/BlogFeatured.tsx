import Link from 'next/link';
import { Archive, Calendar, ChevronRight, Clock, User } from 'lucide-react';
import { Frame, CutoutBadge, AppButton } from '@/shared/ui';
import type { TFunction } from 'i18next';
import { CATEGORY_ICONS, DEFAULT_CATEGORY_ICON } from './constants';

interface IBlogFeaturedProps {
  t: TFunction<'blog'>;
  locale: string;
  slug: string;
  category: string;
  date: string;
  readTime: number;
  author: string;
}

export const BlogFeatured = ({
                               t,
                               locale,
                               slug,
                               category,
                               date,
                               readTime,
                               author,
                             }: IBlogFeaturedProps) => {
  const Icon = CATEGORY_ICONS[category] ?? DEFAULT_CATEGORY_ICON;

  return (
    <div className="relative">
      <div className="pointer-events-none absolute -inset-8 -z-10 rounded-[3rem] bg-[radial-gradient(ellipse_at_center,rgba(45,212,191,0.15),transparent_65%)] blur-2xl" />

      <Frame
        theme="blog"
        headerIcon={Archive}
        headerTitle={`SYS.ARCHIVE // ENTRY.${t('featured.code')}`}
        footer={
          <div className="flex w-full items-center justify-between font-mono text-[10px] tracking-widest text-blog-dim uppercase">
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blog-accent shadow-[0_0_5px_var(--color-blog-accent)]" />
              {t('featured.status')}
            </span>
            <span className="text-blog-border">PRIORITY.TRANSMISSION</span>
          </div>
        }
      >
        <Link
          href={`/${locale}/blog/${slug}`}
          className="group relative block overflow-hidden p-6 sm:p-10"
        >
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(45,212,191,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(45,212,191,0.03)_1px,transparent_1px)] bg-size-[30px_30px]" />

          <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-10">
            <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-sm border border-blog-accent/40 bg-blog-panel text-blog-accent shadow-[inset_0_0_25px_rgba(45,212,191,0.15),0_0_30px_rgba(45,212,191,0.1)] sm:h-28 sm:w-28">
              <div className="absolute inset-1.5 border border-dashed border-blog-accent/20" />
              <Icon className="relative h-10 w-10 sm:h-14 sm:w-14" strokeWidth={1.3} />
            </div>

            <div className="flex-1">
              <div className="mb-3 flex flex-wrap items-center gap-3">
                <CutoutBadge theme="blog">{t(`categories.${category}`)}</CutoutBadge>
                <CutoutBadge theme="blog">● {t('featured.badge')}</CutoutBadge>
              </div>

              <h2 className="text-2xl leading-tight font-bold text-blog-text transition-colors group-hover:text-blog-accent-hover sm:text-3xl md:text-4xl">
                {t(`posts.${slug}.title`)}
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-blog-muted sm:text-base">
                {t(`posts.${slug}.excerpt`)}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-4">
                <div className="flex flex-wrap items-center gap-3 font-mono text-[10px] tracking-widest text-blog-dim uppercase">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3 w-3" />
                    {date}
                  </span>
                  <span className="h-1 w-1 rounded-full bg-blog-border" />
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3 w-3" />
                    T-{String(readTime).padStart(2, '0')}
                  </span>
                  <span className="h-1 w-1 rounded-full bg-blog-border" />
                  <span className="flex items-center gap-1.5">
                    <User className="h-3 w-3" />
                    OPR: {author}
                  </span>
                </div>

                <AppButton
                  variant="blog"
                  size="md"
                  className="pointer-events-none ml-auto font-mono text-[10px] font-bold tracking-widest uppercase"
                  tabIndex={-1}
                >
                  {t('readEntry')}
                  <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </AppButton>
              </div>
            </div>
          </div>
        </Link>
      </Frame>
    </div>
  );
};