import { Search, ArrowUpDown } from 'lucide-react';
import { TAB_OPTIONS, SORT_OPTIONS, type TTabType, type TSortOption } from '../model';
import { FloatingInput, Tabs, AppButton } from '@/shared/ui';
import { usePipelines } from '@/entities';

interface PipelineSearchAndFilterProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  statusFilter: TTabType;
  onStatusFilterChange: (tab: TTabType) => void;
  sortBy: TSortOption['value'];
  sortOrder: 'asc' | 'desc';
  onSortChange: (by: TSortOption['value'], order: 'asc' | 'desc') => void;
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
  const { pipelines } = usePipelines();

  const toggleSortOrder = () => {
    onSortChange(sortBy, sortOrder === 'asc' ? 'desc' : 'asc');
  };

  if (!pipelines || pipelines.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
      <div className="group relative w-full sm:w-80">
        <FloatingInput
          rounded="xl"
          label="Search pipelines"
          value={searchQuery}
          onChange={onSearchChange}
          icon={<Search className="h-4 w-4" />}
        />
      </div>

      <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto">
        <Tabs
          tabs={TAB_OPTIONS}
          layoutId="pipelines-search-tabs"
          currentTab={statusFilter}
          onTabChange={(id) => onStatusFilterChange(id as TTabType)}
          capitalizeLabels
        />

        <div className="bg-muted/40 border-border/60 flex h-11 items-center gap-1.5 rounded-xl border px-3 shadow-xs backdrop-blur-md">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as TSortOption['value'], sortOrder)}
            className="text-foreground cursor-pointer border-0 bg-transparent py-1 pr-1 pl-1 text-sm font-medium outline-none"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <AppButton
            variant="ghost"
            size="xs"
            icon={ArrowUpDown}
            onClick={toggleSortOrder}
            className="h-auto min-h-0 rounded-lg p-1.5"
          />
        </div>
      </div>
    </div>
  );
};
