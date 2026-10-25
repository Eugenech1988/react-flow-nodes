import { useState } from 'react';
import { useUser } from '@/shared/hooks';
import { PLAN_USAGE_STATS } from '../../model';
import { UsageChartModal, type UsageStatItem } from './UsageChartModal';

export const UsageStats = () => {
  const { isProActive } = useUser();
  const [selectedStat, setSelectedStat] = useState<UsageStatItem | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {PLAN_USAGE_STATS(isProActive).map((stat, idx) => (
          <div
            key={idx}
            onClick={() => setSelectedStat(stat)}
            className="group border-border bg-card relative cursor-pointer space-y-3 rounded-xl border p-4 shadow-xs transition-all duration-200 hover:border-teal-500/50 hover:bg-teal-500/5 hover:shadow-md hover:shadow-teal-500/5"
          >
            <div className="text-muted-foreground flex items-center justify-between text-xs">
              <span className="text-foreground flex items-center gap-1.5 font-medium transition-colors group-hover:text-teal-600 dark:group-hover:text-teal-400">
                {stat.icon} {stat.label}
              </span>
              <span className="text-foreground/90 font-medium">{stat.value}</span>
            </div>

            <div className="bg-muted/60 h-2 w-full overflow-hidden rounded-full">
              <div
                className={`h-full transition-all duration-500 ${stat.barColor}`}
                style={{ width: `${Math.min(stat.percentage, 100)}%` }}
              />
            </div>

            <div className="text-muted-foreground flex items-end justify-between gap-2 pt-0.5 text-[11px]">
              <span className="line-clamp-2 leading-tight">{stat.sub}</span>

              <span className="shrink-0 text-xs font-medium whitespace-nowrap text-teal-600 opacity-0 transition-opacity duration-200 group-hover:opacity-100 dark:text-teal-400">
                View chart
              </span>
            </div>
          </div>
        ))}
      </div>

      <UsageChartModal stat={selectedStat} onClose={() => setSelectedStat(null)} />
    </>
  );
};
