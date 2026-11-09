import { z } from 'zod';
import {
  createExecutionInputSchema,
  updateExecutionInputSchema,
} from '@pipeline/contracts';
import { router, protectedProcedure } from '@/trpc/init';
import type { ExecutionsService } from './executions.service';

export function createExecutionsRouter(executionsService: ExecutionsService) {
  return router({
    create: protectedProcedure
      .input(createExecutionInputSchema)
      .mutation(async ({ ctx, input }) => {
        return executionsService.create({
          ...input,
          userId: ctx.user.id,
        });
      }),

    list: protectedProcedure
      .input(
        z
          .object({
            pipelineId: z.string().optional(),
            page: z.number().int().positive().optional(),
            limit: z.number().int().positive().optional(),
            search: z.string().optional(),
            status: z.string().optional(),
          })
          .optional(),
      )
      .query(({ ctx, input }) => {
        return executionsService.findAll({
          userId: ctx.user.id,
          pipelineId: input?.pipelineId,
          page: input?.page,
          limit: input?.limit,
          search: input?.search,
          status: input?.status,
        });
      }),

    getById: protectedProcedure.input(z.object({ id: z.string() })).query(({ input }) => {
      return executionsService.findOne(input.id);
    }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.string(),
          data: updateExecutionInputSchema,
        }),
      )
      .mutation(({ input }) => {
        return executionsService.update(input.id, input.data);
      }),

    remove: protectedProcedure.input(z.object({ id: z.string() })).mutation(({ input }) => {
      return executionsService.remove(input.id);
    }),
  });
}