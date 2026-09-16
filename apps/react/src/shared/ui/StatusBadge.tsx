import type { LucideIcon } from 'lucide-react';

export type TStatusConfigItem = {
  label: string;
  icon: LucideIcon;
  className: string;
  iconClassName?: string;
};

type TUniversalStatusBadgeProps = {
  config: TStatusConfigItem;
};

export const StatusBadge = ({ config }: TUniversalStatusBadgeProps) => {
  const { label, icon: Icon, className, iconClassName } = config;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium border ${className}`}
    >
      <Icon className={`h-3 w-3 ${iconClassName ?? ''}`} />
      {label}
    </span>
  );
};