import {
  updatePipelineInputSchema,
  removePipelineInputSchema,
} from '@pipeline/contracts';
import { router, protectedProcedure } from '@/trpc/init';
import type { UpdatePipelineDto } from './dtos/update-pipeline.dto';
import type { PipelinesService } from './pipelines.service';

export function createPipelinesRouter(pipelinesService: PipelinesService) {
  return router({
    list: protectedProcedure.query(({ ctx }) =>
      pipelinesService.findAllByUserId(ctx.user.id),
    ),

    remove: protectedProcedure
      .input(removePipelineInputSchema.pick({ id: true }))
      .mutation(({ ctx, input }) => pipelinesService.remove(input.id, ctx.user.id)),

    update: protectedProcedure.input(updatePipelineInputSchema).mutation(async ({ ctx, input }) => {
      const { id, ...dto } = input;
      return pipelinesService.update(id, ctx.user.id, dto as UpdatePipelineDto);
    }),
  });
}