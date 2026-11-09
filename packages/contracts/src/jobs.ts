import { z } from 'zod';

export const jobDepartmentSchema = z.enum(['ENGINEERING', 'DESIGN', 'RESEARCH', 'OPERATIONS']);

export const jobLevelSchema = z.enum(['JUNIOR', 'MID', 'SENIOR', 'LEAD']);

export const jobTypeSchema = z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP']);

export const jobStatusSchema = z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']);

export const jobTranslationInputSchema = z.object({
  locale: z.string().min(2).max(5),
  title: z.string().min(2),
  description: z.string().min(10),
  responsibilities: z.array(z.string()).default([]),
  requirements: z.array(z.string()).default([]),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

export const createJobInputSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/, 'slug must be kebab-case'),
  department: jobDepartmentSchema,
  level: jobLevelSchema,
  type: jobTypeSchema.default('FULL_TIME'),
  location: z.string().min(1),
  icon: z.string().optional(),
  status: jobStatusSchema.default('DRAFT'),
  translations: z.array(jobTranslationInputSchema).min(1),
});

export const updateJobInputSchema = z.object({
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/)
    .optional(),
  department: jobDepartmentSchema.optional(),
  level: jobLevelSchema.optional(),
  type: jobTypeSchema.optional(),
  location: z.string().min(1).optional(),
  icon: z.string().nullable().optional(),
  status: jobStatusSchema.optional(),
  translations: z.array(jobTranslationInputSchema).optional(),
});

export const upsertJobTranslationInputSchema = z.object({
  locale: z.string().min(2).max(5),
  title: z.string().min(2),
  description: z.string().min(10),
  responsibilities: z.array(z.string()).default([]),
  requirements: z.array(z.string()).default([]),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

export type TCreateJobInputData = z.infer<typeof createJobInputSchema>;
export type TUpdateJobInputData = z.infer<typeof updateJobInputSchema>;
export type TUpsertJobTranslationInputData = z.infer<typeof upsertJobTranslationInputSchema>;
export type TJobDepartment = z.infer<typeof jobDepartmentSchema>;
export type TJobLevel = z.infer<typeof jobLevelSchema>;
export type TJobType = z.infer<typeof jobTypeSchema>;
export type TJobStatus = z.infer<typeof jobStatusSchema>;