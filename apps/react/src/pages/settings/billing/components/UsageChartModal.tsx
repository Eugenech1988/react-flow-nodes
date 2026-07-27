import { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import { Dialog, DialogContent } from '@pipeline/ui'; // или из '@/shared/ui'

import { DialogHeader } from '@/shared/ui';
import { DialogBody } from '@/shared/ui';
import { DialogFooter } from '@/shared/ui';

const MOCK_CHART_DATA = [
  { day: 'Mon', value: 30 },
  { day: 'Tue', value: 45 },
  { day: 'Wed', value: 35 },
  { day: 'Thu', value: 60 },
  { day: 'Fri', value: 75 },
  { day: 'Sat', value: 50 },
  { day: 'Sun', value: 85 },
];

type TimeRange = '7d' | '30d' | '90d';

interface UsageChartModalProps {
  stat: {
    label: string;
    value: string;
    icon?: React.ReactNode;
  } | null;
  onClose: () => void;
}

export const UsageChartModal = ({ stat, onClose }: UsageChartModalProps) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('7d');

  return (
    // 2. Оборачиваем в Dialog с пропом open
    <Dialog open={!!stat} onOpenChange={(open) => !open && onClose()}>
      {/* 3. DialogContent создает нужный контекст useDialogRootContext */}
      <DialogContent showCloseButton={false} className="sm:max-w-2xl p-0 gap-0 overflow-hidden">
        {stat && (
          <>
            <DialogHeader
              title={`${stat.label} Usage`}
              description="Detailed breakdown and historical usage over time"
              icon={stat.icon}
              onClose={onClose}
            />

            <DialogBody withBorder className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-muted-foreground">Current Usage</span>
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                </div>

                <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg text-xs">
                  {(['7d', '30d', '90d'] as TimeRange[]).map((range) => (
                    <button
                      key={range}
                      onClick={() => setTimeRange(range)}
                      className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                        timeRange === range
                          ? 'bg-card text-foreground shadow-xs'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {range.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-64 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={MOCK_CHART_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="chartColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-popover border border-border p-2.5 rounded-lg shadow-md text-xs">
                              <p className="font-semibold text-popover-foreground mb-1">{label}</p>
                              <p className="text-primary font-medium">
                                {stat.label}: {payload[0].value}
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} fillOpacity={1} fill="url(#chartColor)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </DialogBody>

            <DialogFooter cancelText="Close" onCancel={onClose} withBorder={false} />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};