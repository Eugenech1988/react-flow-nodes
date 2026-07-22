export interface IPipeline {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'paused' | 'draft';
  lastRunStatus?: 'success' | 'failed' | 'running';
  lastRunAt?: string;
  updatedAt: string;
  thumbnail: string;
}

export type TTabType = 'all' | 'active' | 'paused' | 'draft'