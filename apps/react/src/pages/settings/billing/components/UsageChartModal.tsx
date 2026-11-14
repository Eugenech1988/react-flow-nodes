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
import { motion } from 'framer-motion';
import { Dialog, DialogContent } from '@pipeline/ui';
import { DialogHeader, DialogBody, DialogFooter } from '@/shared/ui';
import { type IUsageStatItem } from '../../model';

const MOCK_CHART_DATA = [
  { day: 'Mon', value: 30 },
  { day: 'Tue', value: 45 },
  { day: 'Wed', value: 35 },
  { day: 'Thu', value: 60 },
  { day: 'Fri', value: 85 },
  { day: 'Sat', value: 50 },
  { day: 'Sun', value: 95 },
];

type TimeRange = '7d' | '30d' | '90d';

interface IUsageChartModalProps {
  stat: IUsageStatItem | null;
  onClose: () => void;
}

const getLineColor = (value: number) => {
  if (value >= 80) return '#ef4444';
  if (value >= 60) return '#f97316';
  if (value >= 40) return '#f59e0b';
  return '#14b8a6';
};

const FILL_STOPS = [
  { offset: '0%', color: '#ef4444' },
  { offset: '20%', color: '#ef4444' },
  { offset: '21%', color: '#f97316' },
  { offset: '40%', color: '#f97316' },
  { offset: '41%', color: '#f59e0b' },
  { offset: '60%', color: '#f59e0b' },
  { offset: '61%', color: '#14b8a6' },
  { offset: '100%', color: '#14b8a6' },
];

const STROKE_STOPS = [
  { offset: '0%', color: '#ef4444' },
  { offset: '23%', color: '#ef4444' },
  { offset: '24%', color: '#f97316' },
  { offset: '53%', color: '#f97316' },
  { offset: '54%', color: '#f59e0b' },
  { offset: '84%', color: '#f59e0b' },
  { offset: '85%', color: '#14b8a6' },
  { offset: '100%', color: '#14b8a6' },
];

export const UsageChartModal = ({ stat, onClose }: IUsageChartModalProps) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('7d');

  return (
    <Dialog open={!!stat} onOpenChange={(open) => !open && onClose()}>
      <DialogContent showCloseButton={false} className="gap-0 overflow-hidden p-0 sm:max-w-2xl">
        {stat && (
          <>
            <DialogHeader
              title={`${stat.label} Usage`}
              description="Detailed breakdown and historical usage over time"
              icon={<span className="text-teal-600 dark:text-teal-400">{stat.icon}</span>}
              onClose={onClose}
            />

            <DialogBody withBorder className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-muted-foreground text-xs">Current Usage</span>
                  <div className="text-2xl font-bold text-teal-600 dark:text-teal-400">
                    {stat.value}
                  </div>
                </div>

                <div className="bg-muted/60 relative flex items-center gap-1 rounded-lg p-1 text-xs">
                  {(['7d', '30d', '90d'] as TimeRange[]).map((range) => {
                    const isActive = timeRange === range;

                    return (
                      <button
                        key={range}
                        onClick={() => setTimeRange(range)}
                        className={`relative cursor-pointer rounded-md px-2.5 py-1 font-medium transition-colors duration-200 ${
                          isActive
                            ? 'text-teal-600 dark:text-teal-400'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="activeTabIndicator"
                            className="bg-card absolute inset-0 rounded-md shadow-xs"
                            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                          />
                        )}
                        <span className="relative z-10">{range.toUpperCase()}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="h-64 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={MOCK_CHART_DATA}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="strokeGradient" x1="0" y1="0" x2="0" y2="1">
                        {STROKE_STOPS.map((stop, i) => (
                          <stop key={i} offset={stop.offset} stopColor={stop.color} />
                        ))}
                      </linearGradient>

                      <linearGradient id="fillGradient" x1="0" y1="0" x2="0" y2="1">
                        {FILL_STOPS.map((stop, i) => (
                          <stop
                            key={i}
                            offset={stop.offset}
                            stopColor={stop.color}
                            stopOpacity={0.25}
                          />
                        ))}
                      </linearGradient>
                    </defs>

                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="hsl(var(--border))"
                      opacity={0.5}
                    />
                    <XAxis
                      dataKey="day"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    />
                    <YAxis
                      dataKey="value"
                      domain={[0, 100]}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    />

                    <Tooltip
                      cursor={{
                        stroke: 'hsl(var(--muted-foreground))',
                        strokeWidth: 1,
                        strokeDasharray: '4 4',
                      }}
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const val = Number(payload[0].value);
                          const color = getLineColor(val);
                          return (
                            <div className="bg-popover border-border space-y-1 rounded-lg border p-2.5 text-xs shadow-md">
                              <p className="text-popover-foreground font-semibold">{label}</p>
                              <p
                                className="flex items-center gap-1.5 font-medium"
                                style={{ color }}
                              >
                                <span
                                  className="h-2 w-2 rounded-full"
                                  style={{ backgroundColor: color }}
                                />
                                {stat.label}: {val}%
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />

                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="url(#strokeGradient)"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#fillGradient)"
                      activeDot={({ cx, cy, payload }) => {
                        const color = getLineColor(payload.value);
                        return (
                          <circle
                            cx={cx}
                            cy={cy}
                            r={6}
                            fill={color}
                            stroke="hsl(var(--background))"
                            strokeWidth={2}
                          />
                        );
                      }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </DialogBody>

            <DialogFooter
              showSubmit={false}
              cancelText="Close"
              onCancel={onClose}
              withBorder={false}
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
