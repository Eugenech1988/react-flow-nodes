// src/pages/pipelines/types.ts
export interface IPipeline {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'paused' | 'draft';
  lastRunStatus?: 'success' | 'failed' | 'running';
  lastRunAt?: string;
  updatedAt: string;
  screenshotUrl?: string;
  createdAt?: string;
}

export type TTabType = 'all' | 'active' | 'paused' | 'draft';

import { z } from 'zod';

export const createPipelineSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  description: z.string().max(500, 'Description is too long').optional(),
  screenshotUrl: z.string().url('Invalid image URL').optional().or(z.literal('')),
});

export type CreatePipelineDto = z.infer<typeof createPipelineSchema>;