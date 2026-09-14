import { z } from 'zod';

export const executionStatusSchema = z.enum([
  'RUNNING',
  'SUCCESS',
  'FAILED',
  'CANCELED',
]);

export const triggerTypeSchema = z.enum([
  'MANUAL',
  'WEBHOOK',
  'CRON',
  'API',
]);

export const createExecutionInputSchema = z.object({
  id: z.string().optional(),
  pipelineId: z.string(),
  userId: z.string(),
  status: executionStatusSchema.default('RUNNING'),
  triggeredBy: triggerTypeSchema.default('MANUAL'),
  startedAt: z.union([z.string(), z.date()]).optional(),
  finishedAt: z.union([z.string(), z.date()]).nullable().optional(),
  durationMs: z.number().int().nullable().optional(),
  nodesExecuted: z.number().int().default(0),
  logs: z.record(z.string(), z.unknown()).nullable().optional(),
  createdAt: z.union([z.string(), z.date()]).optional(),
  updatedAt: z.union([z.string(), z.date()]).optional(),
});

export const updateExecutionInputSchema = z.object({
  status: executionStatusSchema.optional(),
  finishedAt: z.union([z.string(), z.date()]).nullable().optional(),
  durationMs: z.number().int().nullable().optional(),
  nodesExecuted: z.number().int().optional(),
  logs: z.record(z.string(), z.unknown()).nullable().optional(),
});

export type TExecutionStatus = z.infer<typeof executionStatusSchema>;
export type TTriggerType = z.infer<typeof triggerTypeSchema>;
export type TCreateExecutionInputData = z.infer<typeof createExecutionInputSchema>;
export type TUpdateExecutionInputData = z.infer<typeof updateExecutionInputSchema>;