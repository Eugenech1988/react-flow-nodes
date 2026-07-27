import { z } from 'zod';

export const planSchema = z.enum(['FREE', 'PRO', 'ENTERPRISE']);

export const loginInputSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

export const registerInputSchema = loginInputSchema.extend({
  firstName: z.string().min(1).optional(),
  lastName: z.string().optional(),
  nickName: z.string().min(3).optional(),
});

export const twoFactorTotpOnlySchema = z.object({
  code: z
    .string()
    .min(1, 'Code is required')
    .transform((val) => val.trim())
    .refine((val) => /^\d{6}$/.test(val), {
      message: 'Code must be exactly 6 digits',
    }),
});

export const twoFactorCodeOrBackupSchema = z.object({
  code: z
    .string()
    .min(1, 'Code is required')
    .transform((val) => val.trim().replace(/-/g, ''))
    .refine(
      (val) => /^\d{6}$/.test(val) || /^[a-zA-Z0-9]{8,10}$/.test(val),
      {
        message: 'Enter a valid 6-digit code or recovery code',
      }
    ),
});

export const twoFactorLoginInputSchema = z.object({
  tempToken: z.string().min(1),
  code: twoFactorCodeOrBackupSchema.shape.code,
});

export type TTwoFactorLoginInputData = z.infer<typeof twoFactorLoginInputSchema>;

export const passwordResetInputSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(6),
});

export const updatePasswordInputSchema = z.object({
  currentPassword: z.string().optional().or(z.literal('')),
  newPassword: z.string().min(6),
});

export const updateProfileInputSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  company: z.string().optional(),
  location: z.string().optional(),
  jobTitle: z.string().optional(),
  avatarUrl: z.string().nullable().optional(),
});

export type TUpdateProfileInputData = z.infer<typeof updateProfileInputSchema>;

export const createPipelineInputSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  status: z.enum(['DRAFT', 'ACTIVE', 'PAUSED', 'ARCHIVED']).optional(),
  lastRunAt: z.coerce.date().optional(),
  lastRunStatus: z.string().optional(),
});

export const currentPipelineInputSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable().optional(),
  status: z.enum(['DRAFT', 'ACTIVE', 'PAUSED', 'ARCHIVED']).nullable().optional(),
  lastRunAt: z.union([z.string(), z.date()]).nullable().optional(),
  lastRunStatus: z.enum(['SUCCESS', 'FAILED', 'RUNNING']).nullable().optional(),
  screenshotUrl: z.string().nullable().optional(),
});

export const updatePipelineInputSchema = createPipelineInputSchema.partial().extend({
  id: z.string().min(1),
});

