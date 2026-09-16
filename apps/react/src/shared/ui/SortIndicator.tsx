import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import type { TSortState } from '@/pages/executions/model';

type TSortIndicatorProps = {
  state: TSortState;
};

export const SortIndicator = ({ state }: TSortIndicatorProps) => {
  if (state === 'asc') {
    return <ArrowUp className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />;
  }

  if (state === 'desc') {
    return (
      <ArrowDown className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
    );
  }

  return <ArrowUpDown className="w-3.5 h-3.5 opacity-40 hover:opacity-100" />;
};