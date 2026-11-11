'use client';

import { useMemo, useState } from 'react';
import { Archive } from 'lucide-react';
import { useT } from '@/shared/lib/i18n/client';
import { cn } from '@/shared/lib';
import { BLOG_CATEGORIES, BLOG_PAGE_SIZE, BLOG_POSTS } from './constants';
import { BlogCard } from './BlogCard';
import { BlogPagination } from './BlogPagination';

interface IBlogGridProps {
  locale: string;
}

export const BlogGrid = ({ locale }: IBlogGridProps) => {
  const { t } = useT('blog');
  const [active, setActive] = useState('all');
  const [page, setPage] = useState(1);

  const nonFeatured = useMemo(() => BLOG_POSTS.filter((p) => !p.featured), []);

  const filtered = useMemo(
    () => (active === 'all' ? nonFeatured : nonFeatured.filter((p) => p.category === active)),
    [active, nonFeatured],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / BLOG_PAGE_SIZE));
  const visible = filtered.slice((page - 1) * BLOG_PAGE_SIZE, page * BLOG_PAGE_SIZE);

  const handleCategoryChange = (id: string) => {
    setActive(id);
    setPage(1);
  };

  const handlePageChange = (next: number) => {
    setPage(Math.min(Math.max(1, next), totalPages));
  };

  return (
    <section className="relative z-10 mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Archive className="text-theme-accent h-4 w-4" />
          <span className="text-theme-muted font-mono text-[10px] font-bold tracking-widest uppercase">
            {t('archive.label', { count: filtered.length })}
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {BLOG_CATEGORIES.map((cat) => {
            const isActive = cat.id === active;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategoryChange(cat.id)}
                className={cn(
                  'cursor-pointer rounded-sm border px-3 py-1.5 font-mono text-[9px] font-bold tracking-widest uppercase transition-all sm:text-[10px]',
                  isActive
                    ? 'border-theme-accent bg-theme-accent/15 text-theme-accent-hover shadow-[inset_0_1px_0_color-mix(in_oklab,var(--theme-accent)_40%,transparent),0_0_15px_color-mix(in_oklab,var(--theme-accent)_15%,transparent)]'
                    : 'border-theme-line bg-theme-panel text-theme-muted hover:border-theme-accent/50 hover:text-theme-accent shadow-none',
                )}
              >
                <span className={isActive ? 'text-theme-accent-hover/70' : 'text-theme-dim'}>
                  SEC.{cat.code}
                </span>
                <span className="mx-1.5 opacity-50">//</span>
                <span>{t(`categories.${cat.id}`)}</span>
              </button>
            );
          })}
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="border-theme-line bg-theme-surface text-theme-muted rounded-sm border border-dashed p-12 text-center font-mono text-xs tracking-widest uppercase">
          {t('empty')}
        </div>
      ) : (
        <>
          <div
            key={`${active}-${page}`}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6"
          >
            {visible.map((post) => (
              <BlogCard
                key={post.id}
                id={post.id}
                slug={post.slug}
                category={post.category}
                date={post.date}
                readTime={post.readTime}
                locale={locale}
              />
            ))}
          </div>

          <BlogPagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </section>
  );
};
