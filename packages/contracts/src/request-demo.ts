import { z } from 'zod';

export const demoRequestInputSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Invalid email address' }),
  company: z.string().min(2, { message: 'Company name is required' }),
  message: z.string().optional(),
});

export type TDemoRequestInputData = z.infer<typeof demoRequestInputSchema>;
