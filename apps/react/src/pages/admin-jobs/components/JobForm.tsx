import { useState, useEffect } from 'react';
import { useForm, type FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useTRPC } from '@/shared/api';
import { triggerPortalRevalidate } from '@/shared/api/revalidate';
import { LocalAlert } from '@/shared/ui';
import { useJobMutations } from '../hooks';
import type { IJob } from '../model';
import { jobFormSchema, type TJobFormInput, type TJobFormOutput } from '../model/form-schema';
import { fillTranslation, buildTranslationPayload } from '../model/helpers';
import { JobFormHeader } from './JobFormHeader';
import { JobFormTabs, type TFormTab } from './JobFormTabs';
import { JobFormDetailsTab } from './JobFormDetailsTab';
import { JobFormTranslationTab } from './JobFormTranslationTab';

interface JobFormProps {
  jobId: string | null;
  initialData?: IJob;
  onSuccess: () => void;
  onCancel: () => void;
}

const emptyTranslation = {
  title: '',
  description: '',
  responsibilities: '',
  requirements: '',
  metaTitle: '',
  metaDescription: '',
};

export function JobForm({ jobId, initialData, onSuccess, onCancel }: JobFormProps) {
  const isEditing = !!jobId;
  const { createJob, updateJob } = useJobMutations();

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<TFormTab>('details');
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TJobFormInput, unknown, TJobFormOutput>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: initialData
      ? {
          slug: initialData.slug,
          department: initialData.department,
          level: initialData.level,
          type: initialData.type,
          location: initialData.location,
          icon: initialData.icon ?? '',
          status: initialData.status,
          en: fillTranslation(initialData.translations.find((t) => t.locale === 'en')),
          ua: fillTranslation(initialData.translations.find((t) => t.locale === 'ua')),
        }
      : {
          slug: '',
          department: 'ENGINEERING',
          level: 'MID',
          type: 'FULL_TIME',
          location: 'Remote',
          icon: '',
          status: 'DRAFT',
          en: emptyTranslation,
          ua: emptyTranslation,
        },
  });

  const onSubmit = async (data: TJobFormOutput) => {
    setSubmitError(null);

    const hasUa = data.ua.title.trim().length > 0 || data.ua.description.trim().length > 0;

    try {
      const translationsToSend = [buildTranslationPayload('en', data.en)];
      if (hasUa) {
        translationsToSend.push(buildTranslationPayload('ua', data.ua));
      }

      if (isEditing) {
        await updateJob.mutateAsync({
          id: jobId!,
          data: {
            slug: data.slug,
            department: data.department,
            level: data.level,
            type: data.type,
            location: data.location,
            icon: data.icon || null,
            status: data.status,
            translations: translationsToSend, // передаем массив переводов
          },
        });
      } else {
        await createJob.mutateAsync({
          slug: data.slug,
          department: data.department,
          level: data.level,
          type: data.type,
          location: data.location,
          icon: data.icon || undefined,
          status: data.status,
          translations: translationsToSend,
        });
      }

      queryClient.invalidateQueries(trpc.jobs.adminList.queryFilter());
      queryClient.invalidateQueries(trpc.jobs.adminById.queryFilter());

      await triggerPortalRevalidate();

      onSuccess();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to save job');
    }
  };

  const selectedDept = watch('department');

  useEffect(() => {
    if (!isEditing) {
      const deptIcons: Record<string, string> = {
        ENGINEERING: 'code-2',
        DESIGN: 'palette',
        RESEARCH: 'flask-conical',
        OPERATIONS: 'briefcase',
      };

      if (deptIcons[selectedDept]) {
        setValue('icon', deptIcons[selectedDept]);
      }
    }
  }, [selectedDept, setValue, isEditing]);

  const onInvalid = (formErrors: FieldErrors<TJobFormInput>) => {
    if (formErrors.slug || formErrors.location) setActiveTab('details');
    else if (formErrors.en) setActiveTab('en');
    else if (formErrors.ua) setActiveTab('ua');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-6 pb-12">
      <JobFormHeader isEditing={isEditing} isSubmitting={isSubmitting} onCancel={onCancel} />

      {submitError && <LocalAlert hasError hasSuccess={false} alertMessage={submitError} />}

      <JobFormTabs activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === 'details' && (
        <JobFormDetailsTab register={register} control={control} errors={errors} />
      )}
      {activeTab === 'en' && (
        <JobFormTranslationTab prefix="en" register={register} errors={errors} />
      )}
      {activeTab === 'ua' && (
        <JobFormTranslationTab prefix="ua" register={register} errors={errors} />
      )}
    </form>
  );
}
