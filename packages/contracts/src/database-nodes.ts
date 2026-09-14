import { z } from 'zod';

export const createDatabaseNodeInputSchema = z.object({
  id: z.string().optional().nullable(),
  pipelineId: z.string().nullable(),
  nodeId: z.string(),
  query: z.string().nullable(),
  params: z.record(z.string(), z.unknown()).nullable(),
  data: z.unknown().nullable(),
  status: z.string().nullable(),
  userId: z.string().nullable(),
  createdAt: z.union([z.string(), z.date()]).optional().nullable(),
  updatedAt: z.union([z.string(), z.date()]).optional().nullable(),
});

export type TCreateDatabaseNodeInputData = z.infer<typeof createDatabaseNodeInputSchema>;
