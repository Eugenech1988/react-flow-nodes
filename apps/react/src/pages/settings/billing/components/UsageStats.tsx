import { Cpu, Clock, HardDrive } from 'lucide-react';

interface UsageStat {
  label: string;
  icon: React.ReactNode;
  value: string;
  sub: string;
  percentage: number;
  barColor: string;
}

interface UsageStatsProps {
  isProActive: boolean;
}

export const UsageStats = ({ isProActive }: UsageStatsProps) => {
  const stats: UsageStat[] = [
    {
      label: 'Pipeline Executions',
      icon: <Cpu className="w-4 h-4 text-teal-500" />,
      value: isProActive ? 'Unlimited' : '85 / 100',
      sub: 'Resets on the 1st of next month',
      percentage: isProActive ? 100 : 85,
      barColor: 'bg-teal-600 dark:bg-teal-500',
    },
    {
      label: 'Execution Time',
      icon: <Clock className="w-4 h-4 text-teal-500" />,
      value: isProActive ? '12.4 hrs' : '4.2 / 5 hrs',
      sub: 'Compute hours consumed this cycle',
      percentage: isProActive ? 30 : 84,
      barColor: isProActive ? 'bg-teal-600 dark:bg-teal-500' : 'bg-amber-500',
    },
    {
      label: 'Pipeline Storage',
      icon: <HardDrive className="w-4 h-4 text-teal-500" />,
      value: `1.2 GB / ${isProActive ? '100 GB' : '2 GB'}`,
      sub: 'Artifacts and cache storage',
      percentage: isProActive ? 1.2 : 60,
      barColor: 'bg-teal-600 dark:bg-teal-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat, idx) => (
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