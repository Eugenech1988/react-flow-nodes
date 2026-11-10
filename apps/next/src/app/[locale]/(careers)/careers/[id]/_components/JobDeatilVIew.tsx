'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  MapPin,
  Clock,
  Activity,
  Target,
  ShieldAlert,
  Radio,
  Eye,
  FileText,
  Upload,
  Terminal,
} from 'lucide-react';
import {
  AppButton,
  MonitorFrame,
  Reveal,
  CutoutBadge,
  AppInput,
  AppLabel,
  AppTextarea,
} from '@/shared/ui';
import { useT } from '@/shared/lib/i18n/client';
import type { TPublicJob } from '@/shared/api';
import { LEVEL_LABELS, TYPE_LABELS, resolveJobIcon } from '../../constants';

const applicationSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  position: z.string().min(2, 'Position is required'),
  company: z.string().min(2, 'Company is required'),
  message: z.string().optional(),
  resume: z.any().refine((files) => files?.length > 0, 'Resume is required'),
  coverLetterFile: z.any().optional(),
});

type TApplicationForm = z.infer<typeof applicationSchema>;

interface IJobDetailProps {
  job: TPublicJob;
  locale: string;
}

export const JobDetailView = ({ job, locale }: IJobDetailProps) => {
  const { t } = useT('careers');
  const [isSuccess, setIsSuccess] = useState(false);
  const [coverLetterMode, setCoverLetterMode] = useState<'write' | 'upload'>('write');

  const Icon = resolveJobIcon(job.icon);
  const deptLabel = t(`openings.filters.${job.department.toLowerCase()}`, {
    defaultValue: job.department,
  });
  const typeLabel = t(`openings.types.${job.type}`, {
    defaultValue: TYPE_LABELS[job.type] ?? job.type,
  });
  const levelLabel = t(`openings.levels.${job.level}`, {
    defaultValue: LEVEL_LABELS[job.level] ?? job.level,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TApplicationForm>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      position: job.title,
      company: '',
      name: '',
      email: '',
      message: '',
    },
  });

  const onSubmit = async (data: TApplicationForm) => {
    console.log('Application data:', data);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSuccess(true);
  };

  const scrollToForm = () => {
    document.getElementById('apply-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative z-10 mx-auto max-w-7xl px-4 pt-28 pb-0 sm:px-6">
      <Reveal>
        <Link
          href={`/${locale}/careers`}
          className="mb-8 inline-flex items-center gap-2 font-mono text-[10px] tracking-widest text-[#8a9488] uppercase transition-colors hover:text-[#9cc4b0]"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('details.returnToOpenings', { defaultValue: 'Return to Openings' })}
        </Link>
      </Reveal>

      <div className="flex flex-col gap-12">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_320px] lg:gap-12">
          <Reveal className="relative">
            <MonitorFrame
              theme="careers"
              headerIcon={Activity}
              headerTitle={`SYS.DOSSIER // ${job.slug.toUpperCase()}`}
              footer={
                <div className="flex w-full items-center justify-between font-mono text-[10px] tracking-widest text-[#8a9488] uppercase">
                  <span className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#6fa28c]" />
                    FILE DECRYPTED
                  </span>
                  <span>PAGE 01 / 01</span>
                </div>
              }
            >
              <div className="relative overflow-hidden p-5 sm:p-10">
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(111,162,140,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(111,162,140,0.03)_1px,transparent_1px)] bg-size-[30px_30px]" />

                <div className="relative z-10">
                  <div className="mb-6 flex flex-wrap items-center gap-3">
                    <CutoutBadge>{deptLabel}</CutoutBadge>
                    <span className="font-mono text-[10px] tracking-widest text-[#4a5c52] uppercase">
                      REF: 00{job.slug.length}-A
                    </span>
                  </div>

                  <h1 className="font-typewriter mb-6 truncate text-2xl font-bold tracking-tight text-[#d4cfc0] uppercase sm:text-4xl md:text-5xl">
                    {job.title}
                  </h1>

                  <div className="mb-8 flex flex-wrap items-center gap-x-3 gap-y-2 border-y border-dashed border-[#2f3d36] py-4 font-mono text-[10px] tracking-widest text-[#8a9488] uppercase sm:gap-x-4 sm:text-xs">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-[#6fa28c]" />
                      {job.location}
                    </span>
                    <span className="hidden text-[#2f3d36] sm:inline">/</span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-[#6fa28c]" />
                      {typeLabel}
                    </span>
                    <span className="hidden text-[#2f3d36] sm:inline">/</span>
                    <span className="flex items-center gap-1.5">
                      <Target className="h-3.5 w-3.5 text-[#6fa28c]" />
                      {levelLabel}
                    </span>
                    <span className="hidden text-[#2f3d36] sm:inline">/</span>
                    <span className="flex items-center gap-1.5">
                      <Eye className="h-3.5 w-3.5 text-[#6fa28c]" />
                      {job.views ?? 0} Views
                    </span>
                    <span className="hidden text-[#2f3d36] sm:inline">/</span>
                    <span className="flex items-center gap-1.5">
                      <FileText className="h-3.5 w-3.5 text-[#6fa28c]" />
                      {job.applications ?? 0} Applications
                    </span>
                  </div>

                  <div className="max-w-none">
                    {job.description && (
                      <div className="mb-8">
                        <p className="font-typewriter text-base text-[#d4cfc0] sm:text-lg">
                          {job.description}
                        </p>
                        <div className="mt-6">
                          <AppButton
                            onClick={scrollToForm}
                            variant="careers"
                            size="md"
                            className="w-full sm:w-auto"
                          >
                            Initiate Application
                          </AppButton>
                        </div>
                      </div>
                    )}

                    {job.responsibilities.length > 0 && (
                      <>
                        <h2 className="font-typewriter mt-10 mb-4 flex items-center gap-2 border-b border-[#2f3d36] pb-2 text-lg font-bold tracking-widest text-[#9cc4b0] uppercase sm:text-xl">
                          <ChevronRight className="h-5 w-5" />
                          Key Responsibilities
                        </h2>
                        <ul className="space-y-3 font-mono text-sm text-[#8a9488]">
                          {job.responsibilities.map((item, i) => (
                            <li key={i} className="flex items-start gap-3">
                              <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-sm bg-[#6fa28c]/20 text-[#6fa28c]">
                                <CheckCircle2 className="h-3 w-3" />
                              </span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </>
                    )}

                    {job.requirements.length > 0 && (
                      <>
                        <h3 className="font-typewriter mt-10 mb-4 flex items-center gap-2 border-b border-[#2f3d36] pb-2 text-lg font-bold tracking-widest text-[#9cc4b0] uppercase sm:text-xl">
                          <ChevronRight className="h-5 w-5" />
                          Requirements
                        </h3>
                        <ul className="space-y-3 font-mono text-sm text-[#8a9488]">
                          {job.requirements.map((item, i) => (
                            <li key={i} className="flex items-start gap-3">
                              <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-sm bg-[#6fa28c]/20 text-[#6fa28c]">
                                <CheckCircle2 className="h-3 w-3" />
                              </span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </MonitorFrame>
          </Reveal>

          <div className="hidden lg:sticky lg:top-32 lg:block">
            <Reveal delay={150}>
              <MonitorFrame
                theme="careers"
                headerIcon={Radio}
                headerTitle="TRANSMIT.DATA"
                footer={
                  <div className="flex items-center gap-2 font-mono text-[9px] tracking-widest text-[#6fa28c] uppercase">
                    <ShieldAlert className="h-3 w-3" />
                    SECURE CHANNEL
                  </div>
                }
              >
                <div className="p-6">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl border border-[#4a5c52] bg-[#0a0e0d] text-[#6fa28c] shadow-[inset_0_0_15px_rgba(111,162,140,0.1)]">
                    <Icon className="h-8 w-8" />
                  </div>

                  <h3 className="font-typewriter mb-2 text-lg font-bold text-[#d4cfc0]">
                    Interested in this role?
                  </h3>
                  <p className="mb-6 font-mono text-xs leading-relaxed text-[#8a9488]">
                    Send your dossier and a brief message outlining your craft. Our operators will
                    review it within 24 hours.
                  </p>

                  <AppButton variant="careers" onClick={scrollToForm} size="md" className="w-full">
                    Initiate Application
                  </AppButton>

                  <div className="mt-6 border-t border-[#2f3d36] pt-4 text-center font-mono text-[10px] tracking-widest text-[#4a5c52]">
                    OR SEND DIRECTLY TO
                    <a
                      href="mailto:careers@example.com"
                      className="mt-1 block text-[#6fa28c] hover:text-[#9cc4b0] hover:underline"
                    >
                      CAREERS@EXAMPLE.COM
                    </a>
                  </div>
                </div>
              </MonitorFrame>
            </Reveal>
          </div>
        </div>

        <Reveal delay={100} className="relative">
          <div id="apply-form" className="scroll-mt-32">
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
                      Application Transmitted
                    </h3>
                    <p className="mt-2 font-mono text-sm text-[#8a9488]">
                      We have received your dossier and will contact you shortly.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                      <div className="flex flex-col gap-2">
                        <AppLabel className="font-typewriter text-[10px] tracking-widest text-[#6fa28c] uppercase">
                          Name *
                        </AppLabel>
                        <AppInput
                          placeholder="John Doe"
                          className="font-typewriter rounded-sm border-[#2f3d36] bg-[#0a0e0d]/50 text-[#d4cfc0] shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] placeholder:text-[#4a5c52] focus-visible:border-[#6fa28c]"
                          {...register('name')}
                        />
                        {errors.name && (
                          <p className="font-mono text-xs text-[#c25a5a]">{errors.name.message}</p>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        <AppLabel className="font-typewriter text-[10px] tracking-widest text-[#6fa28c] uppercase">
                          Email *
                        </AppLabel>
                        <AppInput
                          type="email"
                          placeholder="john@example.com"
                          className="font-typewriter rounded-sm border-[#2f3d36] bg-[#0a0e0d]/50 text-[#d4cfc0] shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] placeholder:text-[#4a5c52] focus-visible:border-[#6fa28c]"
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
                          Position *
                        </AppLabel>
                        <AppInput
                          className="font-typewriter rounded-sm border-[#2f3d36] bg-[#0a0e0d]/50 text-[#d4cfc0] shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] placeholder:text-[#4a5c52] focus-visible:border-[#6fa28c]"
                          {...register('position')}
                        />
                        {errors.position && (
                          <p className="font-mono text-xs text-[#c25a5a]">
                            {errors.position.message}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        <AppLabel className="font-typewriter text-[10px] tracking-widest text-[#6fa28c] uppercase">
                          Company *
                        </AppLabel>
                        <AppInput
                          placeholder="Acme Corp"
                          className="font-typewriter rounded-sm border-[#2f3d36] bg-[#0a0e0d]/50 text-[#d4cfc0] shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] placeholder:text-[#4a5c52] focus-visible:border-[#6fa28c]"
                          {...register('company')}
                        />
                        {errors.company && (
                          <p className="font-mono text-xs text-[#c25a5a]">
                            {errors.company.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <AppLabel className="font-typewriter text-[10px] tracking-widest text-[#6fa28c] uppercase">
                        Resume / CV *
                      </AppLabel>
                      <div className="relative">
                        <input
                          type="file"
                          accept=".txt,.pdf,.doc,.docx,.md"
                          className="block w-full cursor-pointer truncate rounded-sm border border-[#2f3d36] bg-[#0a0e0d]/50 p-2 font-mono text-xs text-[#8a9488] file:mr-0 file:mb-2 file:block file:w-full file:cursor-pointer file:rounded file:border-0 file:bg-[#6fa28c]/20 file:px-4 file:py-2 file:font-bold file:text-[#6fa28c] file:uppercase hover:file:bg-[#6fa28c]/30 focus:outline-none sm:file:mr-4 sm:file:mb-0 sm:file:inline-block sm:file:w-auto"
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
                          Cover Letter (Optional)
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
                            Write
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
                            Upload
                          </button>
                        </div>
                      </div>

                      {coverLetterMode === 'write' ? (
                        <AppTextarea
                          rows={4}
                          placeholder="Write your cover letter here..."
                          className="font-typewriter rounded-sm border-[#2f3d36] bg-[#0a0e0d]/50 text-[#d4cfc0] shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] placeholder:text-[#4a5c52] focus-visible:border-[#6fa28c]"
                          {...register('message')}
                        />
                      ) : (
                        <div className="relative">
                          <input
                            type="file"
                            accept=".txt,.pdf,.doc,.docx,.md"
                            className="block w-full cursor-pointer truncate rounded-sm border border-[#2f3d36] bg-[#0a0e0d]/50 p-2 font-mono text-xs text-[#8a9488] file:mr-0 file:mb-2 file:block file:w-full file:cursor-pointer file:rounded file:border-0 file:bg-[#6fa28c]/20 file:px-4 file:py-2 file:font-bold file:text-[#6fa28c] file:uppercase hover:file:bg-[#6fa28c]/30 focus:outline-none sm:file:mr-4 sm:file:mb-0 sm:file:inline-block sm:file:w-auto"
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
                        pendingText="Transmitting..."
                        className="w-full sm:w-auto"
                      >
                        Submit Application
                      </AppButton>
                    </div>
                  </form>
                )}
              </div>
            </MonitorFrame>
          </div>
        </Reveal>
      </div>
    </div>
  );
};
