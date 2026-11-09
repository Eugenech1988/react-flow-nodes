import { z } from 'zod';
import { createJobInputSchema, jobTranslationInputSchema } from '@pipeline/contracts';

export const basicFieldsSchema = createJobInputSchema
  .omit({ translations: true })
  .extend({ icon: z.string() });

export const translationFormFields = jobTranslationInputSchema
  .omit({ locale: true, responsibilities: true, requirements: true })
  .extend({
    responsibilities: z.string(),
    requirements: z.string(),
  });

export const enFormSchema = translationFormFields;

export const uaFormSchema = z
  .object({
    title: translationFormFields.shape.title.or(z.literal('')),
    description: translationFormFields.shape.description.or(z.literal('')),
    responsibilities: z.string(),
    requirements: z.string(),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const hasTitle = data.title.trim().length > 0;
    const hasDescription = data.description.trim().length > 0;
    if (hasTitle !== hasDescription) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: hasTitle
          ? 'Description is required when Ukrainian title is provided'
          : 'Title is required when Ukrainian description is provided',
        path: hasTitle ? ['description'] : ['title'],
      });
    }
  });

export const jobFormSchema = basicFieldsSchema.extend({
  en: enFormSchema,
  ua: uaFormSchema,
});

export type TJobFormInput = z.input<typeof jobFormSchema>;
export type TJobFormOutput = z.output<typeof jobFormSchema>;