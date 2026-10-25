import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

type TSortState = false | 'asc' | 'desc';

type TSortIndicatorProps = {
  state: TSortState;
};

export const SortIndicator = ({ state }: TSortIndicatorProps) => {
  if (state === 'asc') {
    return <ArrowUp className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />;
  }

  if (state === 'desc') {
    return <ArrowDown className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />;
  }

  return <ArrowUpDown className="h-3.5 w-3.5 opacity-40 hover:opacity-100" />;
};
