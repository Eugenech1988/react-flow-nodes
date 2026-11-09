import { z } from 'zod';
import { createDatabaseNodeInputSchema } from '@pipeline/contracts';
import { router, protectedProcedure } from '@/trpc/init';
import type { DatabaseNodesService } from './database-nodes.service';

export function createDatabaseNodesRouter(databaseNodesService: DatabaseNodesService) {
  return router({
    createRecord: protectedProcedure
      .input(createDatabaseNodeInputSchema)
      .mutation(async ({ ctx, input }) => {
        return databaseNodesService.createRecord(ctx.user.id, input);
      }),

    getByNodeId: protectedProcedure
      .input(z.object({ nodeId: z.string() }))
      .query(({ input }) => databaseNodesService.findByNodeId(input.nodeId)),

    getByPipelineId: protectedProcedure
      .input(z.object({ pipelineId: z.string() }))
      .query(({ input }) => databaseNodesService.findByPipelineId(input.pipelineId)),
  });
}