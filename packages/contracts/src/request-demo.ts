import { z } from 'zod';

export const demoRequestInputSchema = z.object({
  firstName: z.string().min(1, 'Please enter your first name'),
  lastName: z.string().min(1, 'Please enter your last name'),
  email: z.string().email('Please enter a valid work email'),
  company: z.string().optional(),
  volume: z.string().optional(),
  message: z.string().optional(),
});

export type TDemoRequestInputData = z.infer<typeof demoRequestInputSchema>;