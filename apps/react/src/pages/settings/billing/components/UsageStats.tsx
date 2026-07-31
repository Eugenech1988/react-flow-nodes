import { useState } from 'react';
import { useUser } from '@/shared/hooks';
import { PLAN_USAGE_STATS } from '@/pages/settings/model';
import { UsageChartModal, type UsageStatItem } from './UsageChartModal';

export const UsageStats = () => {
  const { isProActive } = useUser();
  const [selectedStat, setSelectedStat] = useState<UsageStatItem | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PLAN_USAGE_STATS(isProActive).map((stat, idx) => (
          <div
            key={idx}
            onClick={() => setSelectedStat(stat)}
            className="group relative border border-border bg-card rounded-xl p-4 space-y-3 shadow-xs cursor-pointer transition-all duration-200 hover:border-teal-500/50 hover:bg-teal-500/5 hover:shadow-md hover:shadow-teal-500/5"
          >
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5 font-medium text-foreground group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                {stat.icon} {stat.label}
              </span>
              <span className="font-medium text-foreground/90">{stat.value}</span>
            </div>

            <div className="w-full bg-muted/60 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${stat.barColor}`}
                style={{ width: `${Math.min(stat.percentage, 100)}%` }}
              />
            </div>

            <div className="flex items-end justify-between gap-2 text-[11px] text-muted-foreground pt-0.5">
              <span className="line-clamp-2 leading-tight">
                {stat.sub}
              </span>

              <span className="shrink-0 whitespace-nowrap text-xs font-medium text-teal-600 dark:text-teal-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                View chart
              </span>
            </div>
          </div>
        ))}
      </div>

      <UsageChartModal
        stat={selectedStat}
        onClose={() => setSelectedStat(null)}
      />
    </>
  );
};