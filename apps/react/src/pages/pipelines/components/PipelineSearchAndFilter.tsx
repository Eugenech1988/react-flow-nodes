import { Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { TAB_OPTIONS, type TabType } from '../constants';
import { FloatingInput } from '@/shared/ui';

interface PipelineSearchAndFilterProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  statusFilter: TabType;
  onStatusFilterChange: (tab: TabType) => void;
}

export const PipelineSearchAndFilter = ({
                                          searchQuery,
                                          onSearchChange,
                                          statusFilter,
                                          onStatusFilterChange,
                                        }: PipelineSearchAndFilterProps) => {
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

      <div className="bg-muted/40 border border-border/60 p-1.5 rounded-2xl inline-flex gap-1.5 backdrop-blur-md relative flex-wrap shadow-xs self-start sm:self-auto">
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
    </div>
  );
};