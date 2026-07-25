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

export const twoFactorLoginInputSchema = z.object({
  tempToken: z.string().min(1),
  code: z.string().min(1),
});


export const passwordResetInputSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(6),
});

export const updatePasswordInputSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(6),
});

export const updateTwoFactorInputSchema = z.object({
  user2fa: z.boolean(),
});

export const updateProfileInputSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  company: z.string().optional(),
  location: z.string().optional(),
  jobTitle: z.string().optional(),
});

export const createPipelineInputSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  status: z.enum(['DRAFT', 'ACTIVE', 'PAUSED', 'ARCHIVED']).optional(),
  lastRunAt: z.coerce.date().optional(),
  lastRunStatus: z.string().optional(),
});

export const updatePipelineInputSchema = createPipelineInputSchema.partial().extend({
  id: z.string().min(1),
});

