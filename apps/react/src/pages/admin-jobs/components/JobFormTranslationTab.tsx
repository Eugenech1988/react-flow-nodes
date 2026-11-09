import { type UseFormRegister, type FieldErrors } from 'react-hook-form';
import { FloatingInput, FloatingTextarea } from '@/shared/ui';
import type { TJobFormInput } from '../model';

interface JobFormTranslationTabProps {
  prefix: 'en' | 'ua';
  register: UseFormRegister<TJobFormInput>;
  errors: FieldErrors<TJobFormInput>;
}

export function JobFormTranslationTab({ prefix, register, errors }: JobFormTranslationTabProps) {
  const fieldErrors = errors[prefix];

  return (
    <div className="space-y-5">
      <FloatingInput
        {...register(`${prefix}.title`)}
        label="Title"
        error={!!fieldErrors?.title}
        errorMessage={fieldErrors?.title?.message}
      />
      <FloatingTextarea
        {...register(`${prefix}.description`)}
        label="Description"
        error={!!fieldErrors?.description}
        errorMessage={fieldErrors?.description?.message}
        rows={4}
      />
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <FloatingTextarea
          {...register(`${prefix}.responsibilities`)}
          label="Responsibilities (1 per line)"
          error={!!fieldErrors?.responsibilities}
          errorMessage={fieldErrors?.responsibilities?.message}
          rows={6}
          className="font-mono text-xs"
        />
        <FloatingTextarea
          {...register(`${prefix}.requirements`)}
          label="Requirements (1 per line)"
          error={!!fieldErrors?.requirements}
          errorMessage={fieldErrors?.requirements?.message}
          rows={6}
          className="font-mono text-xs"
        />
      </div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <FloatingInput
          {...register(`${prefix}.metaTitle`)}
          label="Meta Title (SEO)"
          error={!!fieldErrors?.metaTitle}
          errorMessage={fieldErrors?.metaTitle?.message}
        />
        <FloatingInput
          {...register(`${prefix}.metaDescription`)}
          label="Meta Description (SEO)"
          error={!!fieldErrors?.metaDescription}
          errorMessage={fieldErrors?.metaDescription?.message}
        />
      </div>
    </div>
  );
}
