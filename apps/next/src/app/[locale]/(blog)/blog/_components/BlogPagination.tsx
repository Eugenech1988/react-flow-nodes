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

export const BlogPagination = ({
                                 currentPage,
                                 totalPages,
                                 onPageChange,
                               }: IBlogPaginationProps) => {
  const { t } = useT('blog');

  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="relative mt-12 flex flex-col items-center justify-center gap-4 sm:mt-16 sm:flex-row sm:gap-5">
      <AppButton
        variant="blog-outline"
        size="sm"
        icon={ChevronLeft}
        onClick={() => onPageChange(currentPage - 1)}
        isDisabled={currentPage === 1}
        ariaLabel={t('pagination.prev')}
      >
        <span className="hidden sm:inline">{t('pagination.prev')}</span>
      </AppButton>

      <div className="flex items-center gap-1.5">
        {pages.map((page) => {
          const isActive = page === currentPage;
          return (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'relative flex h-8 w-8 cursor-pointer items-center justify-center',
                'rounded-sm border font-mono text-[10px] font-bold tracking-widest transition-all',
                isActive
                  ? 'border-[#2dd4bf] bg-[#2dd4bf]/15 text-[#5eead4] shadow-[inset_0_1px_0_rgba(94,234,212,0.2),0_0_12px_rgba(45,212,191,0.2)]'
                  : 'border-[#1E293B] bg-[#0B1424] text-[#64748b] hover:border-[#2dd4bf]/60 hover:bg-[#050B14] hover:text-[#2dd4bf]',
              )}
            >
              {String(page).padStart(2, '0')}
              {isActive && (
                <span className="absolute -bottom-px left-1/2 h-px w-3 -translate-x-1/2 bg-[#5eead4] shadow-[0_0_6px_rgba(45,212,191,0.8)]" />
              )}
            </button>
          );
        })}
      </div>

      <AppButton
        variant="blog-outline"
        size="sm"
        icon={ChevronRight}
        iconClassName="order-2"
        onClick={() => onPageChange(currentPage + 1)}
        isDisabled={currentPage === totalPages}
        ariaLabel={t('pagination.next')}
      >
        <span className="order-1 hidden sm:inline">{t('pagination.next')}</span>
      </AppButton>
    </div>
  );
};