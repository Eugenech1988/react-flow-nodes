import { z } from 'zod';

export const planSchema = z.enum(['FREE', 'PRO', 'ENTERPRISE']);
export type PlanType = z.infer<typeof planSchema>;
