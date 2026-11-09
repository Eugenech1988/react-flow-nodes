import {
  updatePasswordInputSchema,
  currentPipelineInputSchema,
} from '@pipeline/contracts';
import { router, protectedProcedure } from '@/trpc/init';
import { toSafeUser } from './users.helpers';
import type { UsersService } from './users.service';

export function createUsersRouter(usersService: UsersService) {
  return router({
    updatePassword: protectedProcedure
      .input(updatePasswordInputSchema)
      .mutation(async ({ ctx, input }) => {
        await usersService.updatePassword(ctx.user.id, input);
        return { success: true };
      }),

    remove: protectedProcedure.mutation(async ({ ctx }) => {
      await usersService.delete(ctx.user.id);
      return { success: true };
    }),

    setCurrentPipeline: protectedProcedure
      .input(currentPipelineInputSchema)
      .mutation(async ({ ctx, input }) => {
        const updatedUser = await usersService.setCurrentPipeline(ctx.user.id, input.id);
        return toSafeUser(updatedUser);
      }),
  });
}