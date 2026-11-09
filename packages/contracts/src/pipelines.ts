import { z } from 'zod';

export const nodeSchema = z
  .object({
    id: z.string(),
    type: z.string(),
    position: z.object({
      x: z.number(),
      y: z.number(),
    }),
    data: z.record(z.string(), z.unknown()),
  })
  .passthrough();

export const edgeSchema = z
  .object({
    id: z.string(),
    source: z.string(),
    target: z.string(),
    sourceHandle: z.string().nullable().optional(),
    targetHandle: z.string().nullable().optional(),
  })
  .passthrough();

export const graphDataSchema = z.object({
  nodes: z.array(nodeSchema),
  edges: z.array(edgeSchema),
});

export type TNodeData = z.infer<typeof nodeSchema>;
export type TEdgeData = z.infer<typeof edgeSchema>;
export type TGraphData = z.infer<typeof graphDataSchema>;

export const createPipelineInputSchema = z.object({
  name: z.string().min(1, 'Pipeline name is required'),
  description: z.string().optional().nullable(),
  // Добавлены поля, которые могут прийти с фронта (опционально)
  status: z.enum(['DRAFT', 'ACTIVE', 'PAUSED', 'ARCHIVED']).optional(),
  lastRunAt: z.coerce.date().optional().nullable(),
  lastRunStatus: z.string().optional().nullable(),
  screenshotUrl: z.string().optional().nullable(),
  screenshotBase64: z.string().optional().nullable(),
});
export type TCreatePipelineInputData = z.infer<typeof createPipelineInputSchema>;

export const updatePipelineInputSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  description: z.string().optional().nullable(),
  status: z.enum(['DRAFT', 'ACTIVE', 'PAUSED', 'ARCHIVED']).optional(),
  lastRunAt: z.coerce.date().optional().nullable(),
  lastRunStatus: z.string().optional().nullable(),
  graphData: graphDataSchema.optional(),
  screenshotBase64: z.string().optional().nullable(),
  screenshotUrl: z.string().optional().nullable(),
});
export type TUpdatePipelineInputData = z.infer<typeof updatePipelineInputSchema>;

export const removePipelineInputSchema = z.object({
  id: z.string().min(1, 'Pipeline ID is required'),
});
export type TRemovePipelineInputData = z.infer<typeof removePipelineInputSchema>;

export const currentPipelineInputSchema = z.object({
  id: z.string().min(1, 'Pipeline ID is required'),
  name: z.string().optional(),
  description: z.string().nullish(),
  status: z.enum(['ACTIVE', 'PAUSED', 'DRAFT', 'ARCHIVED']).nullable().optional(),
  lastRunAt: z.union([z.string(), z.date()]).nullish(),
  lastRunStatus: z.enum(['SUCCESS', 'FAILED', 'RUNNING']).nullish(),
  screenshotUrl: z.string().nullish(),
});
export type TCurrentPipelineInputData = z.infer<typeof currentPipelineInputSchema>;
