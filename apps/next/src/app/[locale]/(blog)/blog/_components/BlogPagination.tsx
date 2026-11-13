'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useT } from '@/shared/lib/i18n/client';
import { AppButton } from '@/shared/ui';
import { cn } from '@/shared/lib';

interface IBlogPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const BlogPagination = ({ currentPage, totalPages, onPageChange }: IBlogPaginationProps) => {
  const { t } = useT('blog');

  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="relative flex w-full flex-row flex-wrap items-center justify-center gap-2 pt-12 sm:gap-4">
      <AppButton
        variant="blog-outline"
        size="sm"
        icon={ChevronLeft}
        onClick={() => onPageChange(currentPage - 1)}
        isDisabled={currentPage === 1}
        ariaLabel={t('pagination.prev')}
        className="h-8 w-8 shrink-0 px-0 sm:h-auto sm:w-auto sm:px-4 sm:py-1.5"
      >
        <span className="hidden sm:inline">{t('pagination.prev')}</span>
      </AppButton>

      <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
        {pages.map((page) => {
          const isActive = page === currentPage;
          return (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'relative flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center',
                'rounded-sm border font-mono text-[10px] font-bold tracking-widest transition-all',
                isActive
                  ? 'border-theme-accent bg-theme-accent/15 text-theme-accent-hover shadow-[inset_0_1px_0_color-mix(in_oklab,var(--theme-accent-hover)_20%,transparent),0_0_12px_color-mix(in_oklab,var(--theme-accent)_20%,transparent)]'
                  : 'border-theme-line bg-theme-bg/80 text-theme-muted hover:border-theme-accent/60 hover:bg-theme-panel hover:text-theme-accent',
              )}
            >
              {String(page).padStart(2, '0')}
              {isActive && (
                <span className="bg-theme-accent-hover absolute -bottom-px left-1/2 h-px w-3 -translate-x-1/2 shadow-[0_0_6px_color-mix(in_oklab,var(--theme-accent)_80%,transparent)]" />
              )}
            </button>
          );
        })}
      </div>

      <AppButton
        variant="blog-outline"
        size="sm"
        icon={ChevronRight}
        iconClassName="order-2 sm:order-1"
        onClick={() => onPageChange(currentPage + 1)}
        isDisabled={currentPage === totalPages}
        ariaLabel={t('pagination.next')}
        className="h-8 w-8 shrink-0 px-0 sm:h-auto sm:w-auto sm:px-4 sm:py-1.5"
      >
        <span className="order-1 hidden sm:order-2 sm:inline">{t('pagination.next')}</span>
      </AppButton>
    </div>
  );
};
