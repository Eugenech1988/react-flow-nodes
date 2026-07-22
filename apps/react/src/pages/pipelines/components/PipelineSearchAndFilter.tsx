// src/pages/pipelines/components/PipelineSearchAndFilter.tsx
import { Search, ArrowUpDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { TAB_OPTIONS, SORT_OPTIONS, type TabType, type SortOption } from '../constants';
import { FloatingInput } from '@/shared/ui';

interface PipelineSearchAndFilterProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  statusFilter: TabType;
  onStatusFilterChange: (tab: TabType) => void;
  sortBy: SortOption['value'];
  sortOrder: 'asc' | 'desc';
  onSortChange: (by: SortOption['value'], order: 'asc' | 'desc') => void;
}

export const PipelineSearchAndFilter = ({
                                          searchQuery,
                                          onSearchChange,
                                          statusFilter,
                                          onStatusFilterChange,
                                          sortBy,
                                          sortOrder,
                                          onSortChange,
                                        }: PipelineSearchAndFilterProps) => {
  const toggleSortOrder = () => {
    onSortChange(sortBy, sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="relative w-full sm:w-80 group">
        <FloatingInput
          fieldsetClasses="rounded-xl"
          label="Search pipelines"
          value={searchQuery}
          onChange={onSearchChange}
          icon={<Search className="w-4 h-4" />}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
        <div className="bg-muted/40 border border-border/60 p-1.5 rounded-2xl inline-flex gap-1.5 backdrop-blur-md relative flex-wrap shadow-xs">
          {TAB_OPTIONS.map((tab) => {
            const isActive = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onStatusFilterChange(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-all cursor-pointer border-0 outline-none relative z-10 select-none ${
                  isActive
                    ? 'text-teal-700 dark:text-teal-300 font-semibold shadow-xs'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activePipelineTabIndicator"
                    className="absolute inset-0 bg-teal-500/10 dark:bg-teal-500/20 border border-teal-500/30 rounded-xl -z-10"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="capitalize">{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-1.5 bg-muted/40 border border-border/60 p-1.5 rounded-2xl backdrop-blur-md shadow-xs">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption['value'], sortOrder)}
            className="bg-transparent border-0 text-sm font-medium text-foreground outline-none cursor-pointer pr-1 py-1 pl-2"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <button
            onClick={toggleSortOrder}
            className="p-1.5 rounded-lg hover:bg-muted/60 transition-colors text-muted-foreground hover:text-foreground"
            aria-label="Toggle sort order"
          >
            <ArrowUpDown className="w-4 h-4" />
            <span className="sr-only">{sortOrder === 'asc' ? 'Ascending' : 'Descending'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};