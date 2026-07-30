import { z } from 'zod';

export const planSchema = z.enum(['FREE', 'PRO', 'ENTERPRISE']);
export type PlanType = z.infer<typeof planSchema>;

export const loginInputSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
});
export type LoginInputData = z.infer<typeof loginInputSchema>;

export const registerInputSchema = loginInputSchema.extend({
  firstName: z.string().min(1, 'First name is required').optional(),
  lastName: z.string().optional(),
  nickName: z.string().min(3, 'Nickname must be at least 3 characters').optional(),
});
export type RegisterInputData = z.infer<typeof registerInputSchema>;

export const registerFormInputSchema = registerInputSchema
  .extend({
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });
export type RegisterFormInputData = z.infer<typeof registerFormInputSchema>;

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
  tempToken: z.string().min(1, 'Temp token is required'),
  code: twoFactorCodeOrBackupSchema.shape.code,
});
export type TTwoFactorLoginInputData = z.infer<typeof twoFactorLoginInputSchema>;

export const passwordResetInputSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
})
export type TPasswordResetInputData = z.infer<typeof passwordResetInputSchema>;

export const requestResetInputSchema = z.object({
  email: z
    .string().min(1, 'Email is required')
    .email('Invalid email address'),
})
export type TRequestResetInputData = z.infer<typeof requestResetInputSchema>;

export const updatePasswordInputSchema = z.object({
  currentPassword: z.string().optional().or(z.literal('')),
  newPassword: z
    .string()
    .min(1, 'New password is required')
    .min(6, 'Password must be at least 6 characters'),
});
export type TUpdatePasswordInputData = z.infer<typeof updatePasswordInputSchema>;

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
  name: z.string().min(1, 'Pipeline name is required'),
  description: z.string().optional(),
  screenshotUrl: z.string().optional(),
});
export type TCreatePipelineInputData = z.infer<typeof createPipelineInputSchema>;

export const currentPipelineInputSchema = z.object({
  id: z.string().min(1, 'Pipeline ID is required'),
  name: z.string().min(1, 'Pipeline name is required'),
  description: z.string().nullish(),
  status: z.enum(['ACTIVE', 'PAUSED', 'DRAFT', 'ARCHIVED']).nullable().optional(),
  lastRunAt: z.union([z.string(), z.date()]).nullish(),
  lastRunStatus: z.enum(['SUCCESS', 'FAILED', 'RUNNING']).nullish(),
  screenshotUrl: z.string().nullish(),
});
export type TCurrentPipelineInputData = z.infer<typeof currentPipelineInputSchema>;

export const removePipelineInputSchema = createPipelineInputSchema.partial().extend({
  id: z.string().min(1, 'Pipeline ID is required'),
});
export type TRemovePipelineInputData = z.infer<typeof removePipelineInputSchema>;

const nodeSchema = z
  .object({
    id: z.string(),
    type: z.string(),
    position: z.object({
      x: z.number(),
      y: z.number(),
    }),
    data: z.record(z.string(), z.unknown()),
  })
  .passthrough();

const edgeSchema = z
  .object({
    id: z.string(),
    source: z.string(),
    target: z.string(),
    sourceHandle: z.string().nullable().optional(),
    targetHandle: z.string().nullable().optional(),
  })
  .passthrough();

export const graphDataSchema = z.object({
  nodes: z.array(nodeSchema),
  edges: z.array(edgeSchema),
});

export const updatePipelineInputSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(['DRAFT', 'ACTIVE', 'PAUSED', 'ARCHIVED']).optional(),
  lastRunAt: z.coerce.date().optional(),
  lastRunStatus: z.string().optional(),
  graphData: graphDataSchema.optional(),
  screenshotBase64: z.string().optional(),
});
export type TUpdatePipelineInputData = z.infer<typeof updatePipelineInputSchema>;