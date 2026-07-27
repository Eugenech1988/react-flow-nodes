import { useUser } from '@/shared/hooks';
import { PLAN_USAGE_STATS } from '@/pages/settings/lib';

export const UsageStats = () => {
  const { isProActive } = useUser();
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {PLAN_USAGE_STATS(isProActive).map((stat, idx) => (
        <div key={idx} className="border border-border bg-card rounded-xl p-4 space-y-3 shadow-xs">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5 font-medium text-foreground">
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
          <p className="text-[11px] text-muted-foreground">{stat.sub}</p>
        </div>
      ))}
    </div>
  );
};