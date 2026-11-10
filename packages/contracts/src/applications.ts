import { z } from 'zod';

export const jobApplicationInputSchema = z.object({
  jobId: z.string(),
  name: z.string().min(2),
  email: z.string().email(),
  position: z.string().min(2),
  company: z.string().min(2),
  message: z.string().optional(),
});

export const applicationIdInputSchema = z.object({
  id: z.string(),
});

export const applicationListFilterInputSchema = z.object({
  jobId: z.string().optional(),
}).optional();

export type TJobApplicationInputData = z.infer<typeof jobApplicationInputSchema>;
export type TApplicationIdData = z.infer<typeof applicationIdInputSchema>;
export type TApplicationListFilterData = z.infer<typeof applicationListFilterInputSchema>;

export type TJobApplicationCreateData = TJobApplicationInputData & {
  resumeUrl: string;
  coverLetterUrl?: string;
};