import { z } from 'zod';

export const createDatabaseNodeInputSchema = z.object({
  id: z.string().optional(),
  pipelineId: z.string().nullable(),
  nodeId: z.string(),
  query: z.string().nullable(),
  params: z.record(z.string(), z.unknown()).nullable(),
  data: z.unknown().nullable(),
  status: z.string().nullable(),
  userId: z.string().nullable(),
  createdAt: z.union([z.string(), z.date()]).optional(),
  updatedAt: z.union([z.string(), z.date()]),
});

export type TCreateDatabaseNodeInputData = z.infer<typeof createDatabaseNodeInputSchema>;
