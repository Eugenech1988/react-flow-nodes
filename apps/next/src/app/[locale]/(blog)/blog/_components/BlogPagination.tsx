'use client';

import { useT } from '@/shared/lib/i18n/client';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface IBlogPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const BlogPagination = ({ currentPage, totalPages, onPageChange }: IBlogPaginationProps) => {
  const { t } = useT('blog');

  if (totalPages <= 1) return null;

  return (
    <div className="mt-12 flex items-center justify-center gap-6 font-mono text-[10px] uppercase tracking-widest text-blog-dim sm:text-xs">
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex cursor-pointer items-center gap-1 transition-colors hover:text-blog-accent disabled:pointer-events-none disabled:opacity-30"
      >
        <ChevronLeft className="h-3 w-3" />
        {t('pagination.prev')}
      </button>

      <span className="flex items-center gap-2 rounded-sm border border-blog-border bg-blog-surface px-4 py-1.5 text-blog-accent shadow-[inset_0_1px_0_rgba(45,212,191,0.05)]">
        <span className="opacity-50">PAGE</span>
        {String(currentPage).padStart(2, '0')} / {String(totalPages).padStart(2, '0')}
      </span>

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex cursor-pointer items-center gap-1 transition-colors hover:text-blog-accent disabled:pointer-events-none disabled:opacity-30"
      >
        {t('pagination.next')}
        <ChevronRight className="h-3 w-3" />
      </button>
    </div>
  );
};