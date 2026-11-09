import { useState, useEffect } from 'react';
import { useForm, type FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useTRPC } from '@/shared/api';
import { triggerPortalRevalidate } from '@/shared/api/revalidate';
import { LocalAlert, GlobalLoader } from '@/shared/ui';
import { useAdminJob, useJobMutations } from '../hooks';
import type { IJob } from '../model';
import {
  jobFormSchema,
  type TJobFormInput,
  type TJobFormOutput,
} from '../model/form-schema';
import { fillTranslation, buildTranslationPayload } from '../model/helpers';
import { JobFormHeader } from './JobFormHeader';
import { JobFormTabs, type TFormTab } from './JobFormTabs';
import { JobFormDetailsTab } from './JobFormDetailsTab';
import { JobFormTranslationTab } from './JobFormTranslationTab';

interface JobFormProps {
  jobId: string | null;
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

export function JobForm({ jobId, onSuccess, onCancel }: JobFormProps) {
  const isEditing = !!jobId;
  const { data: existingJob, isLoading } = useAdminJob(jobId);
  const { createJob, updateJob } = useJobMutations();

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<TFormTab>('details');
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TJobFormInput, unknown, TJobFormOutput>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
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

  useEffect(() => {
    if (!existingJob) return;
    const job = existingJob as IJob;

    reset({
      slug: job.slug,
      department: job.department,
      level: job.level,
      type: job.type,
      location: job.location,
      icon: job.icon ?? '',
      status: job.status,
      en: fillTranslation(job.translations.find((t) => t.locale === 'en')),
      ua: fillTranslation(job.translations.find((t) => t.locale === 'ua')),
    });
  }, [existingJob, reset]);

  const onSubmit = async (data: TJobFormOutput) => {
    setSubmitError(null);

    const hasUa = data.ua.title.trim().length > 0 || data.ua.description.trim().length > 0;

    try {
      // Формируем массив переводов. Если UA пустой — мы его НЕ отправляем.
      // Бэкенд увидит, что UA нет в массиве, и удалит его из базы.
      const translationsToSend = [buildTranslationPayload('en', data.en)];
      if (hasUa) {
        translationsToSend.push(buildTranslationPayload('ua', data.ua));
      }

      if (isEditing) {
        // ЕДИНЫЙ ЗАПРОС на сохранение
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

      // Инвалидация React Query
      queryClient.invalidateQueries(trpc.jobs.adminList.queryFilter());
      queryClient.invalidateQueries(trpc.jobs.adminById.queryFilter());

      // Сброс кэша Next.js
      await triggerPortalRevalidate();

      onSuccess();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to save job');
    }
  };

  const onInvalid = (formErrors: FieldErrors<TJobFormInput>) => {
    if (formErrors.slug || formErrors.location) setActiveTab('details');
    else if (formErrors.en) setActiveTab('en');
    else if (formErrors.ua) setActiveTab('ua');
  };

  if (isEditing && isLoading) return <GlobalLoader />;

  return (
    <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-6 pb-12">
      <JobFormHeader
        isEditing={isEditing}
        isSubmitting={isSubmitting}
        onCancel={onCancel}
      />

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