import { z } from 'zod';

export const postStatusSchema = z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']);

export const postTranslationInputSchema = z.object({
  locale: z.string().min(2).max(5),
  title: z.string().min(2),
  excerpt: z.string().min(10),
  content: z.string().min(10),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

export const createPostInputSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/, 'slug must be kebab-case'),
  status: postStatusSchema.default('DRAFT'),
  coverImage: z.string().nullable().optional(),
  translations: z.array(postTranslationInputSchema).min(1),
});

export const updatePostInputSchema = z.object({
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/)
    .optional(),
  status: postStatusSchema.optional(),
  coverImage: z.string().nullable().optional(),
  translations: z.array(postTranslationInputSchema).optional(),
});

export type TCreatePostInputData = z.infer<typeof createPostInputSchema>;
export type TUpdatePostInputData = z.infer<typeof updatePostInputSchema>;
