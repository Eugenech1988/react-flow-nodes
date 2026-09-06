import { z } from 'zod';

export const updateProfileInputSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  company: z.string().optional(),
  location: z.string().optional(),
  jobTitle: z.string().optional(),
  avatarUrl: z.string().nullable().optional(),
});
export type TUpdateProfileInputData = z.infer<typeof updateProfileInputSchema>;
