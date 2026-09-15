import { STATUS_CONFIG } from '@/pages/executions/model';
import type { TRunStatus } from '@/pages/executions/model';

type TStatusBadgeProps = {
  status: TRunStatus;
};

export const StatusBadge = ({ status }: TStatusBadgeProps) => {
  const { label, icon: Icon, className, iconClassName } = STATUS_CONFIG[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium border ${className}`}
    >
      <Icon className={`h-3 w-3 ${iconClassName ?? ''}`} />
      {label}
    </span>
  );
};