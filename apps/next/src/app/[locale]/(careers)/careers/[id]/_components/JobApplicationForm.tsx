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
import { AppButton, MonitorFrame, AppInput, AppLabel, AppTextarea } from '@/shared/ui';

interface JobApplicationFormProps {
  job: TPublicJob;
  locale: string;
  setApplicationsCount: React.Dispatch<React.SetStateAction<number>>;
}

export const JobApplicationForm = ({
  job,
  locale,
  setApplicationsCount,
}: JobApplicationFormProps) => {
  const { t } = useT('careers');
  const [isSuccess, setIsSuccess] = useState(false);
  const [coverLetterMode, setCoverLetterMode] = useState<'write' | 'upload'>('write');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const localizedSchema = jobApplicationInputSchema.extend({
    name: z.string().min(2, { message: t('applicationForm.errors.name') }),
    email: z.string().email({ message: t('applicationForm.errors.email') }),
    position: z.string().min(2, { message: t('applicationForm.errors.position') }),
    company: z.string().min(2, { message: t('applicationForm.errors.company') }),
    resume: z
      .any()
      .refine((files) => files?.length > 0, { message: t('applicationForm.errors.resume') }),
    coverLetterFile: z.any().optional(),
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
    'rounded-sm font-typewriter shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] bg-[#0a0e0d]/50';
  const inputErrorStyles =
    'border-[#c25a5a] text-[#c25a5a] placeholder:text-[#c25a5a]/60 focus-visible:border-[#c25a5a] focus-visible:ring-[#c25a5a]/50';
  const inputDefaultStyles =
    'border-[#2f3d36] text-[#d4cfc0] placeholder:text-[#4a5c52] focus-visible:border-[#6fa28c] focus-visible:ring-[#6fa28c]/50';

  const getInputStyles = (hasError: boolean) =>
    `${inputBaseStyles} ${hasError ? inputErrorStyles : inputDefaultStyles}`;

  const fileInputStyles = (hasError: boolean) =>
    `block w-full cursor-pointer truncate rounded-sm border bg-[#0a0e0d]/50 p-2 font-mono text-xs text-[#8a9488] file:mr-0 file:mb-2 file:block file:w-full file:cursor-pointer file:rounded file:border-0 file:bg-[#6fa28c]/20 file:px-4 file:py-2 file:font-bold file:text-[#6fa28c] file:uppercase hover:file:bg-[#6fa28c]/30 focus:outline-none sm:file:mr-4 sm:file:mb-0 sm:file:inline-block sm:file:w-auto ${
      hasError ? 'border-[#c25a5a]' : 'border-[#2f3d36]'
    }`;

  return (
    <MonitorFrame
      theme="careers"
      headerIcon={Terminal}
      headerTitle="APPLICATION.FORM"
      footer={
        <div className="flex w-full items-center justify-between font-mono text-[10px] tracking-widest text-[#8a9488] uppercase">
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#6fa28c]" />
            AWAITING INPUT
          </span>
        </div>
      }
    >
      <div className="p-5 sm:p-10">
        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-[#6fa28c]/50 bg-[#6fa28c]/10 shadow-[0_0_30px_rgba(45,212,191,0.2)]">
              <CheckCircle2 className="h-10 w-10 text-[#6fa28c]" />
            </div>
            <h3 className="font-typewriter text-xl font-bold text-[#d4cfc0]">
              {t('applicationForm.successTitle')}
            </h3>
            <p className="mt-2 font-mono text-sm text-[#8a9488]">
              {t('applicationForm.successDescription')}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
            {errorMsg && (
              <div className="rounded-md border border-[#c25a5a]/50 bg-[#c25a5a]/10 p-3 font-mono text-sm text-[#c25a5a]">
                {errorMsg}
              </div>
            )}

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <AppLabel className="font-typewriter text-[10px] tracking-widest text-[#6fa28c] uppercase">
                  {t('applicationForm.labels.name')}
                </AppLabel>
                <AppInput
                  placeholder={t('applicationForm.placeholders.name')}
                  className={getInputStyles(!!errors.name)}
                  error={!!errors.name}
                  {...register('name')}
                />
                {errors.name && (
                  <p className="font-mono text-xs text-[#c25a5a]">{errors.name.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <AppLabel className="font-typewriter text-[10px] tracking-widest text-[#6fa28c] uppercase">
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
                  <p className="font-mono text-xs text-[#c25a5a]">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <AppLabel className="font-typewriter text-[10px] tracking-widest text-[#6fa28c] uppercase">
                  {t('applicationForm.labels.position')}
                </AppLabel>
                <AppInput
                  className={getInputStyles(!!errors.position)}
                  error={!!errors.position}
                  {...register('position')}
                />
                {errors.position && (
                  <p className="font-mono text-xs text-[#c25a5a]">{errors.position.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <AppLabel className="font-typewriter text-[10px] tracking-widest text-[#6fa28c] uppercase">
                  {t('applicationForm.labels.company')}
                </AppLabel>
                <AppInput
                  placeholder={t('applicationForm.placeholders.company')}
                  className={getInputStyles(!!errors.company)}
                  error={!!errors.company}
                  {...register('company')}
                />
                {errors.company && (
                  <p className="font-mono text-xs text-[#c25a5a]">{errors.company.message}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <AppLabel className="font-typewriter text-[10px] tracking-widest text-[#6fa28c] uppercase">
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
                <p className="font-mono text-xs text-[#c25a5a]">
                  {errors.resume.message as string}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                <AppLabel className="font-typewriter text-[10px] tracking-widest text-[#6fa28c] uppercase">
                  {t('applicationForm.labels.coverLetter')}
                </AppLabel>

                <div className="flex w-full rounded-md border border-[#2f3d36] bg-[#0a0e0d]/50 p-1 sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setCoverLetterMode('write')}
                    className={`flex flex-1 items-center justify-center px-3 py-1.5 text-center font-mono text-[10px] uppercase transition-colors sm:flex-none ${
                      coverLetterMode === 'write'
                        ? 'rounded bg-[#6fa28c]/20 text-[#9cc4b0]'
                        : 'text-[#8a9488] hover:text-[#9cc4b0]'
                    }`}
                  >
                    {t('applicationForm.buttons.write')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setCoverLetterMode('upload')}
                    className={`flex flex-1 items-center justify-center px-3 py-1.5 text-center font-mono text-[10px] uppercase transition-colors sm:flex-none ${
                      coverLetterMode === 'upload'
                        ? 'rounded bg-[#6fa28c]/20 text-[#9cc4b0]'
                        : 'text-[#8a9488] hover:text-[#9cc4b0]'
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

            <div className="mt-4 flex justify-end border-t border-[#2f3d36]/50 pt-5">
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
    </MonitorFrame>
  );
};
