import { Search, ArrowUpDown } from 'lucide-react';
import { TAB_OPTIONS, SORT_OPTIONS, type TTabType, type TSortOption } from '../constants';
import { FloatingInput, Tabs } from '@/shared/ui';

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
  const toggleSortOrder = () => {
    onSortChange(sortBy, sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const formattedTabs = TAB_OPTIONS.map((tab) => ({
    id: tab.id,
    label: tab.label,
  }));

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="relative w-full sm:w-80 group">
        <FloatingInput
          rounded='xl'
          label="Search pipelines"
          value={searchQuery}
          onChange={onSearchChange}
          icon={<Search className="w-4 h-4" />}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
        <Tabs
          tabs={formattedTabs}
          currentTab={statusFilter}
          onTabChange={(id) => onStatusFilterChange(id as TTabType)}
          capitalizeLabels
        />

        <div className="h-11 flex items-center gap-1.5 bg-muted/40 border border-border/60 px-3 rounded-xl backdrop-blur-md shadow-xs">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as TSortOption['value'], sortOrder)}
            className="bg-transparent border-0 text-sm font-medium text-foreground outline-none cursor-pointer pr-1 py-1 pl-1"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={toggleSortOrder}
            className="p-1.5 rounded-lg hover:bg-muted/60 transition-colors text-muted-foreground hover:text-foreground cursor-pointer"
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