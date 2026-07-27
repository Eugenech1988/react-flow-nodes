import { useState } from 'react';
import { useUser } from '@/shared/hooks';
import { PLAN_USAGE_STATS } from '@/pages/settings/lib';
import { UsageChartModal } from './UsageChartModal'; // импортируем созданную модалку

export const UsageStats = () => {
  const { isProActive } = useUser();
  const [selectedStat, setSelectedStat] = useState<any | null>(null);


  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PLAN_USAGE_STATS(isProActive).map((stat, idx) => (
          <div
            key={idx}
            onClick={() => setSelectedStat(stat)}
            className="border border-border bg-card rounded-xl p-4 space-y-3 shadow-xs cursor-pointer hover:border-primary/50 transition-all hover:shadow-sm group"
          >
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5 font-medium text-foreground group-hover:text-primary transition-colors">
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
            <div className="flex items-center justify-between text-[11px] text-muted-foreground">
              <span>{stat.sub}</span>
              <span className="text-primary opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                View chart →
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Модальное окно с графиком */}
      <UsageChartModal
        stat={selectedStat}
        onClose={() => setSelectedStat(null)}
      />
    </>
  );
};