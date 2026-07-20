import { z } from 'zod';

export const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required').optional(),
  email: z.string().email('Invalid email address').optional(),
  company: z.string().optional(),
  location: z.string().optional(),
  jobTitle: z.string().optional(),
});

export type IProfileFormData = z.infer<typeof profileSchema>;