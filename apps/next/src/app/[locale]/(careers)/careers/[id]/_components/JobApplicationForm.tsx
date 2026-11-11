'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CheckCircle2, Upload, Terminal } from 'lucide-react';
import { useT } from '@/shared/lib/i18n/client';
import { submitJobApplication } from '@/shared/api/applications';
import { jobApplicationInputSchema } from '@pipeline/contracts';
import type { TPublicJob } from '@/shared/api';
import { AppButton, Frame, AppInput, AppLabel, AppTextarea } from '@/shared/ui';

interface IJobApplicationFormProps {
  job: TPublicJob;
  locale: string;
  setApplicationsCount: React.Dispatch<React.SetStateAction<number>>;
}

export const JobApplicationForm = ({
  job,
  locale,
  setApplicationsCount,
}: IJobApplicationFormProps) => {
  const { t } = useT('careers');
  const [isSuccess, setIsSuccess] = useState(false);
  const [coverLetterMode, setCoverLetterMode] = useState<'write' | 'upload'>('write');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const localizedSchema = jobApplicationInputSchema.extend({
    name: z.string().min(2, { message: t('applicationForm.errors.name') }),
    email: z.string().email({ message: t('applicationForm.errors.email') }),
    position: z.string().min(2, { message: t('applicationForm.errors.position') }),
    company: z.string().min(2, { message: t('applicationForm.errors.company') }),
    resume: z.custom<FileList>(
      (files) => typeof FileList !== 'undefined' && files instanceof FileList && files.length > 0,
      { message: t('applicationForm.errors.resume') },
    ),
    coverLetterFile: z
      .custom<FileList>((files) => typeof FileList === 'undefined' || files instanceof FileList)
      .optional(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.input<typeof localizedSchema>, unknown, z.output<typeof localizedSchema>>({
    resolver: zodResolver(localizedSchema),
    defaultValues: {
      jobId: job.id,
      position: job.title,
      company: '',
      name: '',
      email: '',
      message: '',
    },
  });

  const onSubmit = async (data: z.output<typeof localizedSchema>) => {
    setErrorMsg(null);
    setApplicationsCount((prev) => prev + 1);

    const formData = new FormData();
    formData.append('jobId', data.jobId);
    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('company', data.company);
    formData.append('position', data.position);

    if (data.message) {
      formData.append('message', data.message);
    }
    if (data.resume?.[0]) {
      formData.append('resume', data.resume[0]);
    }
    if (data.coverLetterFile?.[0]) {
      formData.append('coverLetterFile', data.coverLetterFile[0]);
    }

    try {
      const success = await submitJobApplication(formData, job.slug, locale);
      if (success) {
        setIsSuccess(true);
      } else {
        setApplicationsCount((prev) => Math.max(0, prev - 1));
        setErrorMsg(t('applicationForm.errors.submitFailed'));
      }
    } catch (error) {
      console.error('Application submit error:', error);
      setApplicationsCount((prev) => Math.max(0, prev - 1));
      setErrorMsg(t('applicationForm.errors.submitFailed'));
    }
  };

  const inputBaseStyles =
    'rounded-sm font-typewriter shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] bg-theme-bg/50';
  const inputErrorStyles =
    'border-theme-danger text-theme-danger placeholder:text-theme-danger/60 focus-visible:border-theme-danger focus-visible:ring-theme-danger/50';
  const inputDefaultStyles =
    'border-theme-line text-theme-fg placeholder:text-theme-dim focus-visible:border-theme-accent focus-visible:ring-theme-accent/50';

  const getInputStyles = (hasError: boolean) =>
    `${inputBaseStyles} ${hasError ? inputErrorStyles : inputDefaultStyles}`;

  const fileInputStyles = (hasError: boolean) =>
    `block w-full cursor-pointer truncate rounded-sm border bg-theme-bg/50 p-2 font-mono text-xs text-theme-muted file:mr-0 file:mb-2 file:block file:w-full file:cursor-pointer file:rounded file:border-0 file:bg-theme-accent/20 file:px-4 file:py-2 file:font-bold file:text-theme-accent file:uppercase hover:file:bg-theme-accent/30 focus:outline-none sm:file:mr-4 sm:file:mb-0 sm:file:inline-block sm:file:w-auto ${
      hasError ? 'border-theme-danger' : 'border-theme-line'
    }`;

  return (
    <Frame
      theme="careers"
      headerIcon={Terminal}
      headerTitle="APPLICATION.FORM"
      footer={
        <div className="text-theme-muted flex w-full items-center justify-between font-mono text-[10px] tracking-widest uppercase">
          <span className="flex items-center gap-2">
            <span className="bg-theme-accent h-1.5 w-1.5 animate-pulse rounded-full" />
            AWAITING INPUT
          </span>
        </div>
      }
    >
      <div className="p-5 sm:p-10">
        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="border-theme-accent/50 bg-theme-accent/10 mb-6 flex h-20 w-20 items-center justify-center rounded-full border shadow-[0_0_30px_color-mix(in_oklab,var(--theme-accent)_25%,transparent)]">
              <CheckCircle2 className="text-theme-accent h-10 w-10" />
            </div>
            <h3 className="font-typewriter text-theme-fg text-xl font-bold">
              {t('applicationForm.successTitle')}
            </h3>
            <p className="text-theme-muted mt-2 font-mono text-sm">
              {t('applicationForm.successDescription')}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
            {errorMsg && (
              <div className="border-theme-danger/50 bg-theme-danger/10 text-theme-danger rounded-md border p-3 font-mono text-sm">
                {errorMsg}
              </div>
            )}

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <AppLabel className="font-typewriter text-theme-accent text-[10px] tracking-widest uppercase">
                  {t('applicationForm.labels.name')}
                </AppLabel>
                <AppInput
                  placeholder={t('applicationForm.placeholders.name')}
                  className={getInputStyles(!!errors.name)}
                  error={!!errors.name}
                  {...register('name')}
                />
                {errors.name && (
                  <p className="text-theme-danger font-mono text-xs">{errors.name.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <AppLabel className="font-typewriter text-theme-accent text-[10px] tracking-widest uppercase">
                  {t('applicationForm.labels.email')}
                </AppLabel>
                <AppInput
                  type="email"
                  placeholder={t('applicationForm.placeholders.email')}
                  className={getInputStyles(!!errors.email)}
                  error={!!errors.email}
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-theme-danger font-mono text-xs">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <AppLabel className="font-typewriter text-theme-accent text-[10px] tracking-widest uppercase">
                  {t('applicationForm.labels.position')}
                </AppLabel>
                <AppInput
                  className={getInputStyles(!!errors.position)}
                  error={!!errors.position}
                  {...register('position')}
                />
                {errors.position && (
                  <p className="text-theme-danger font-mono text-xs">{errors.position.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <AppLabel className="font-typewriter text-theme-accent text-[10px] tracking-widest uppercase">
                  {t('applicationForm.labels.company')}
                </AppLabel>
                <AppInput
                  placeholder={t('applicationForm.placeholders.company')}
                  className={getInputStyles(!!errors.company)}
                  error={!!errors.company}
                  {...register('company')}
                />
                {errors.company && (
                  <p className="text-theme-danger font-mono text-xs">{errors.company.message}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <AppLabel className="font-typewriter text-theme-accent text-[10px] tracking-widest uppercase">
                {t('applicationForm.labels.resume')}
              </AppLabel>
              <div className="relative">
                <input
                  type="file"
                  accept=".txt,.pdf,.doc,.docx,.md"
                  className={fileInputStyles(!!errors.resume)}
                  {...register('resume')}
                />
              </div>
              {errors.resume && (
                <p className="text-theme-danger font-mono text-xs">{errors.resume.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                <AppLabel className="font-typewriter text-theme-accent text-[10px] tracking-widest uppercase">
                  {t('applicationForm.labels.coverLetter')}
                </AppLabel>

                <div className="border-theme-line bg-theme-bg/50 flex w-full rounded-md border p-1 sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setCoverLetterMode('write')}
                    className={`flex flex-1 items-center justify-center px-3 py-1.5 text-center font-mono text-[10px] uppercase transition-colors sm:flex-none ${
                      coverLetterMode === 'write'
                        ? 'bg-theme-accent/20 text-theme-accent-hover rounded'
                        : 'text-theme-muted hover:text-theme-accent-hover'
                    }`}
                  >
                    {t('applicationForm.buttons.write')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setCoverLetterMode('upload')}
                    className={`flex flex-1 items-center justify-center px-3 py-1.5 text-center font-mono text-[10px] uppercase transition-colors sm:flex-none ${
                      coverLetterMode === 'upload'
                        ? 'bg-theme-accent/20 text-theme-accent-hover rounded'
                        : 'text-theme-muted hover:text-theme-accent-hover'
                    }`}
                  >
                    {t('applicationForm.buttons.upload')}
                  </button>
                </div>
              </div>

              {coverLetterMode === 'write' ? (
                <AppTextarea
                  rows={4}
                  placeholder={t('applicationForm.placeholders.coverLetter')}
                  className={getInputStyles(!!errors.message)}
                  error={!!errors.message}
                  {...register('message')}
                />
              ) : (
                <div className="relative">
                  <input
                    type="file"
                    accept=".txt,.pdf,.doc,.docx,.md"
                    className={fileInputStyles(false)}
                    {...register('coverLetterFile')}
                  />
                </div>
              )}
            </div>

            <div className="border-theme-line/50 mt-4 flex justify-end border-t pt-5">
              <AppButton
                type="submit"
                variant="careers"
                size="md"
                icon={Upload}
                isPending={isSubmitting}
                pendingText={t('applicationForm.buttons.submitting')}
                className="w-full sm:w-auto"
              >
                {t('applicationForm.buttons.submit')}
              </AppButton>
            </div>
          </form>
        )}
      </div>
    </Frame>
  );
};
