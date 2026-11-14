import type { ReactNode } from 'react';

export interface IUsageStatItem {
  label: string;
  value: string;
  percentage: number;
  barColor: string;
  sub: string;
  icon?: ReactNode;
}