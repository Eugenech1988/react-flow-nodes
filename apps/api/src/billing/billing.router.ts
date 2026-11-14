import { checkoutPlanInputSchema } from '@pipeline/contracts';
import { router, protectedProcedure } from '@/trpc/init';
import type { BillingService } from './billing.service';

export const createBillingRouter = (billingService: BillingService) => {
  return router({
    subscription: protectedProcedure.query(({ ctx }) =>
      billingService.getSubscriptionByUserId(ctx.user.id),
    ),

    transactions: protectedProcedure.query(({ ctx }) =>
      billingService.getTransactionsByUserId(ctx.user.id),
    ),

    checkout: protectedProcedure
      .input(checkoutPlanInputSchema)
      .mutation(({ ctx, input }) =>
        billingService.createCheckoutSession(ctx.user.id, input.plan, input.cycle),
      ),

    cancel: protectedProcedure.mutation(({ ctx }) =>
      billingService.cancelSubscription(ctx.user.id),
    ),
  });
};
