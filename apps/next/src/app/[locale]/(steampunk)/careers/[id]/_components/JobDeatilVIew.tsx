'use client';

import Link from 'next/link';
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
} from 'lucide-react';
import { AppButton, MonitorFrame, Reveal, CutoutBadge } from '@/shared/ui';
import { useT } from '@/shared/lib/i18n/client';
import { InquiryModal } from '@/features';
import { JOBS } from '../../constants';

interface IJobDetailProps {
  jobId: string;
  locale: string;
}

export const JobDetailView = ({ jobId, locale }: IJobDetailProps) => {
  const { t } = useT('careers');

  const job = JOBS.find((j) => j.id === jobId);
  const Icon = job?.icon;
  const dept = job?.dept ?? '';

  const responsibilities = t(`details.${jobId}.responsibilities`, {
    returnObjects: true,
    defaultValue: [],
  }) as string[];

  const requirements = t(`details.${jobId}.requirements`, {
    returnObjects: true,
    defaultValue: [],
  }) as string[];

  const description = t(`details.${jobId}.description`, {
    defaultValue: t('details.default.description'),
  });

  const respList = Array.isArray(responsibilities) && responsibilities.length > 0
    ? responsibilities
    : (t('details.default.responsibilities', { returnObjects: true }) as string[]);

  const reqList = Array.isArray(requirements) && requirements.length > 0
    ? requirements
    : (t('details.default.requirements', { returnObjects: true }) as string[]);

  return (
    <div className="relative z-10 mx-auto max-w-5xl px-4 pt-24 pb-12 sm:px-6 sm:pt-32 sm:pb-16">      <Reveal>
        <Link
          href={`/${locale}/careers`}
          className="mb-8 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-[#8a9488] transition-colors hover:text-[#9cc4b0]"
        >
          <ArrowLeft className="h-4 w-4" />
          Return to Openings
        </Link>
      </Reveal>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px] lg:items-start lg:gap-12">
        <Reveal className="relative">
          <MonitorFrame
            theme="steampunk"
            headerIcon={Activity}
            headerTitle={`SYS.DOSSIER // ${jobId.toUpperCase()}`}
            footer={
              <div className="flex w-full items-center justify-between font-mono text-[10px] tracking-widest uppercase text-[#8a9488]">
                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#6fa28c]" />
                  FILE DECRYPTED
                </span>
                <span>PAGE 01 / 01</span>
              </div>
            }
          >
            <div className="relative overflow-hidden p-6 sm:p-10">
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(111,162,140,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(111,162,140,0.03)_1px,transparent_1px)] bg-size-[30px_30px]" />

              <div className="relative z-10">
                <div className="mb-6 flex flex-wrap items-center gap-3">
                  <CutoutBadge>{t(`openings.filters.${dept}`)}</CutoutBadge>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#4a5c52]">
                    REF: 00{jobId.length}-A
                  </span>
                </div>

                <h1 className="mb-6 text-3xl font-bold tracking-tight text-[#d4cfc0] sm:text-4xl md:text-5xl font-typewriter uppercase">
                  {t(`openings.list.${jobId}.title`)}
                </h1>

                <div className="mb-8 flex flex-wrap items-center gap-4 border-y border-dashed border-[#2f3d36] py-4 font-mono text-[10px] uppercase tracking-widest text-[#8a9488] sm:text-xs">
                  <span className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-[#6fa28c]" />
                    {t(`openings.list.${jobId}.location`)}
                  </span>
                  <span className="text-[#2f3d36]">/</span>
                  <span className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-[#6fa28c]" />
                    {t(`openings.list.${jobId}.type`)}
                  </span>
                  <span className="text-[#2f3d36]">/</span>
                  <span className="flex items-center gap-2">
                    <Target className="h-3.5 w-3.5 text-[#6fa28c]" />
                    {t(`openings.list.${jobId}.level`)}
                  </span>
                </div>

                <div className="max-w-none">
                  <p className="text-lg text-[#d4cfc0] font-typewriter">{description}</p>

                  <h2 className="mt-10 mb-4 flex items-center gap-2 border-b border-[#2f3d36] pb-2 font-typewriter text-xl font-bold uppercase tracking-widest text-[#9cc4b0]">
                    <ChevronRight className="h-5 w-5" />
                    Key Responsibilities
                  </h2>
                  <ul className="space-y-3 font-mono text-sm text-[#8a9488]">
                    {respList.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-sm bg-[#6fa28c]/20 text-[#6fa28c]">
                          <CheckCircle2 className="h-3 w-3" />
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>

                  <h3 className="mt-10 mb-4 flex items-center gap-2 border-b border-[#2f3d36] pb-2 font-typewriter text-xl font-bold uppercase tracking-widest text-[#9cc4b0]">
                    <ChevronRight className="h-5 w-5" />
                    Requirements
                  </h3>
                  <ul className="space-y-3 font-mono text-sm text-[#8a9488]">
                    {reqList.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-sm bg-[#6fa28c]/20 text-[#6fa28c]">
                          <CheckCircle2 className="h-3 w-3" />
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </MonitorFrame>
        </Reveal>

        {/* Сайдбар */}
        <Reveal delay={150} className="lg:sticky lg:top-32">
          <MonitorFrame
            theme="steampunk"
            headerIcon={Radio}
            headerTitle="TRANSMIT.DATA"
            footer={
              <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-widest text-[#6fa28c]">
                <ShieldAlert className="h-3 w-3" />
                SECURE CHANNEL
              </div>
            }
          >
            <div className="p-6">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl border border-[#4a5c52] bg-[#0a0e0d] text-[#6fa28c] shadow-[inset_0_0_15px_rgba(111,162,140,0.1)]">
                {Icon && <Icon className="h-8 w-8" />}
              </div>

              <h3 className="mb-2 font-typewriter text-lg font-bold text-[#d4cfc0]">
                Interested in this role?
              </h3>
              <p className="mb-6 font-mono text-xs leading-relaxed text-[#8a9488]">
                Send your dossier and a brief message outlining your craft. Our operators will
                review it within 24 hours.
              </p>

              <InquiryModal theme="steampunk" type="contact">
                <AppButton variant="steampunk" size="lg" className="w-full">
                  Initiate Application
                </AppButton>
              </InquiryModal>

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
  );
};