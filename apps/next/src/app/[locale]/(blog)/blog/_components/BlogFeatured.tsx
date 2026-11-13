import Link from 'next/link';
import { Archive, Calendar, ChevronRight, Clock, User } from 'lucide-react';
import { Frame, AppButton, Badge } from '@/shared/ui';
import type { TFunction } from 'i18next';
import { CATEGORY_ICONS, DEFAULT_CATEGORY_ICON } from '@/shared/lib/sanity';
import { IBlogPostPreview } from '.';

interface IBlogFeaturedProps {
  t: TFunction<'blog'>;
  post: IBlogPostPreview;
  locale: string;
}

export const BlogFeatured = ({ t, post, locale }: IBlogFeaturedProps) => {
  const Icon = CATEGORY_ICONS[post.category] ?? DEFAULT_CATEGORY_ICON;
  const entryId = post.id ? post.id.slice(0, 6).toUpperCase() : '------';

  return (
    <div className="relative">
      <div className="pointer-events-none absolute -inset-8 -z-10 rounded-[3rem] bg-[radial-gradient(ellipse_at_center,color-mix(in_oklab,var(--theme-accent)_15%,transparent),transparent_65%)] blur-2xl" />

      <Frame
        theme="blog"
        headerIcon={Archive}
        headerTitle={`SYS.ARCHIVE // ENTRY.${entryId}`}
        footer={
          <div className="text-theme-dim flex w-full items-center justify-between font-mono text-[10px] tracking-widest uppercase">
            <span className="flex items-center gap-2">
              <span className="bg-theme-accent h-1.5 w-1.5 animate-pulse rounded-full shadow-[0_0_5px_var(--theme-accent)]" />
              {t('featured.status')}
            </span>
            <span className="text-theme-line">PRIORITY.TRANSMISSION</span>
          </div>
        }
      >
        <Link
          href={`/${locale}/blog/${post.slug}`}
          className="group relative block overflow-hidden p-6 sm:p-10"
        >
          <div className="theme-grid pointer-events-none absolute inset-0 bg-size-[30px_30px]" />

          <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-10">
            <div className="border-theme-accent/40 bg-theme-panel text-theme-accent relative flex h-20 w-20 shrink-0 items-center justify-center rounded-sm border shadow-[inset_0_0_25px_color-mix(in_oklab,var(--theme-accent)_15%,transparent),0_0_30px_color-mix(in_oklab,var(--theme-accent)_10%,transparent)] sm:h-28 sm:w-28">
              <div className="border-theme-accent/20 absolute inset-1.5 border border-dashed" />
              <Icon className="relative h-10 w-10 sm:h-14 sm:w-14" strokeWidth={1.3} />
            </div>

            <div className="flex-1">
              <div className="mb-3 flex flex-wrap items-center gap-3">
                <Badge variant="hex" theme="blog">
                  {t(`categories.${post.category}`)}
                </Badge>
                <Badge variant="hex" theme="blog">
                  ● {t('featured.badge')}
                </Badge>
              </div>

              <h2 className="text-theme-fg group-hover:text-theme-accent-hover text-2xl leading-tight font-bold transition-colors sm:text-3xl md:text-4xl">
                {post.title}
              </h2>

              <p className="text-theme-muted mt-4 max-w-2xl text-sm leading-relaxed sm:text-base">
                {post.excerpt}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-4">
                <div className="text-theme-dim flex flex-wrap items-center gap-3 font-mono text-[10px] tracking-widest uppercase">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3 w-3" />
                    {post.date}
                  </span>
                  <span className="bg-theme-line h-1 w-1 rounded-full" />
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3 w-3" />
                    T-{String(post.readTime).padStart(2, '0')}
                  </span>
                  <span className="bg-theme-line h-1 w-1 rounded-full" />
                  <span className="flex items-center gap-1.5">
                    <User className="h-3 w-3" />
                    OPR: {post.author}
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
