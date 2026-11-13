'use client';

import { useMemo, useState, type ChangeEvent } from 'react';
import { Archive, Search, X, ChevronDown } from 'lucide-react';
import { useT } from '@/shared/lib/i18n/client';
import { cn } from '@/shared/lib';
import { BLOG_CATEGORIES, BLOG_PAGE_SIZE, IBlogPostPreview, BlogCard, BlogPagination } from '.';

interface IBlogGridProps {
  posts: IBlogPostPreview[];
  locale: string;
}

export const BlogGrid = ({ posts, locale }: IBlogGridProps) => {
  const { t } = useT('blog');
  const [active, setActive] = useState('all');
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const nonFeatured = useMemo(() => posts.filter((p) => !p.featured), [posts]);

  const filtered = useMemo(() => {
    let result =
      active === 'all' ? nonFeatured : nonFeatured.filter((p) => p.category === active);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) => p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q),
      );
    }

    return result;
  }, [active, nonFeatured, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / BLOG_PAGE_SIZE));
  const visible = filtered.slice((page - 1) * BLOG_PAGE_SIZE, page * BLOG_PAGE_SIZE);

  const handleCategoryChange = (id: string) => {
    setActive(id);
    setPage(1);
    setIsFilterOpen(false);
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  const handlePageChange = (next: number) => {
    setPage(Math.min(Math.max(1, next), totalPages));
  };

  const activeCategory = BLOG_CATEGORIES.find((c) => c.id === active) ?? BLOG_CATEGORIES[0];

  return (
    <section className="relative z-10 mx-auto max-w-6xl overflow-x-hidden px-4 py-12 sm:px-6 sm:py-16">
      <div className="mb-8 flex flex-col gap-4">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <Archive className="text-theme-accent h-4 w-4" />
            <span className="text-theme-muted font-mono text-[10px] font-bold tracking-widest uppercase">
              {t('archive.label', { count: filtered.length })}
            </span>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="text-theme-dim absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2" />
            <input
              type="text"
              placeholder={t('search.placeholder', { defaultValue: 'SYS.GREP // SEARCH...' })}
              value={searchQuery}
              onChange={handleSearchChange}
              className="border-theme-line bg-theme-panel text-theme-fg placeholder:text-theme-dim focus:border-theme-accent focus:ring-theme-accent/50 w-full rounded-sm border py-2 pr-9 pl-9 font-mono text-[10px] tracking-widest uppercase transition-all outline-none focus:ring-1"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setPage(1);
                }}
                className="text-theme-dim hover:text-theme-accent absolute top-1/2 right-3 -translate-y-1/2 transition-colors"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        <div className="hidden flex-wrap gap-2 md:flex">
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

        <div className="w-full md:hidden">
          <button
            type="button"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="border-theme-line bg-theme-panel text-theme-accent flex w-full items-center justify-between rounded-sm border px-3 py-2 font-mono text-[10px] font-bold tracking-widest uppercase"
          >
            <span>
              SEC.{activeCategory.code} <span className="mx-1.5 opacity-50">//</span>{' '}
              {t(`categories.${activeCategory.id}`)}
            </span>
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-300 ${isFilterOpen ? 'rotate-180' : ''}`}
            />
          </button>

          <div
            className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
              isFilterOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
            }`}
          >
            <div className="overflow-hidden">
              <div className="border-theme-line bg-theme-panel mt-1 flex flex-col rounded-sm border shadow-xl">
                {BLOG_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleCategoryChange(cat.id)}
                    className={cn(
                      'px-3 py-2.5 text-left font-mono text-[10px] font-bold tracking-widest uppercase transition-colors',
                      cat.id === active
                        ? 'bg-theme-accent/20 text-theme-accent-hover'
                        : 'text-theme-muted hover:bg-theme-surface hover:text-theme-accent',
                    )}
                  >
                    <span className={cat.id === active ? 'opacity-70' : 'text-theme-dim'}>
                      SEC.{cat.code}
                    </span>
                    <span className="mx-1.5 opacity-50">//</span>
                    <span>{t(`categories.${cat.id}`)}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="border-theme-line bg-theme-surface text-theme-muted flex flex-col items-center justify-center gap-3 rounded-sm border border-dashed p-12 text-center font-mono text-xs tracking-widest uppercase">
          <span>{t('empty')}</span>
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="text-theme-accent hover:text-theme-accent-hover underline decoration-current/30 underline-offset-4"
            >
              [ CLEAR SEARCH ]
            </button>
          )}
        </div>
      ) : (
        <>
          <div
            key={`${active}-${page}-${searchQuery}`}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6"
          >
            {visible.map((post) => (
              <BlogCard key={post.id ?? post.slug} post={post} locale={locale} />
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
