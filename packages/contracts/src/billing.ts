import { z } from 'zod';

export const planSchema = z.enum(['FREE', 'PRO', 'ENTERPRISE']);
export type PlanType = z.infer<typeof planSchema>;

export const billingCycleSchema = z.enum(['monthly', 'yearly']);
export type TBillingCycle = z.infer<typeof billingCycleSchema>;

export const checkoutPlanInputSchema = z.object({
  plan: z.literal('PRO'),
  cycle: billingCycleSchema,
});
export type TCheckoutPlanInputData = z.infer<typeof checkoutPlanInputSchema>;