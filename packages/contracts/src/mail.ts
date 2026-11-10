import { z } from 'zod';

export const inquiryTypeSchema = z.enum(['demo', 'review', 'contact', 'glitch']);
export type TInquiryTypeData = z.infer<typeof inquiryTypeSchema>;

export const sendInquiryInputSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  company: z.string().min(2),
  position: z.string().min(2),
  message: z.string().min(10),
  type: inquiryTypeSchema.default('demo'),
});

export type TSendInquiryInputData = z.infer<typeof sendInquiryInputSchema>;
