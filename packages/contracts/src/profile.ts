import { z } from 'zod';

export const updateProfileInputSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().nullish(),
  company: z.string().nullish(),
  location: z.string().nullish(),
  jobTitle: z.string().nullish(),
  avatarUrl: z.string().nullish(),
});

export type TUpdateProfileInputData = z.infer<typeof updateProfileInputSchema>;
