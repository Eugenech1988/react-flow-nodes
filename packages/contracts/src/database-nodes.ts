import { z } from 'zod';

export const createDatabaseNodeInputSchema = z.object({
  pipelineId: z.string().optional().nullable(),
  nodeId: z.string().min(1, 'Node ID is required'),
  query: z.string().optional().nullable(),
  params: z.record(z.string(), z.unknown()).optional().nullable(),
  data: z.unknown().optional().nullable(),
  status: z.string().optional().nullable(),
});
export type TCreateDatabaseNodeInputData = z.infer<typeof createDatabaseNodeInputSchema>;

export const databaseNodeRecordSchema = z.object({
  id: z.string(),
  pipelineId: z.string().nullable(),
  nodeId: z.string(),
  query: z.string().nullable(),
  params: z.record(z.string(), z.unknown()).nullable(),
  data: z.unknown().nullable(),
  status: z.string().nullable(),
  userId: z.string().nullable(),
  createdAt: z.union([z.string(), z.date()]),
  updatedAt: z.union([z.string(), z.date()]),
});
export type TDatabaseNodeRecordData = z.infer<typeof databaseNodeRecordSchema>;
