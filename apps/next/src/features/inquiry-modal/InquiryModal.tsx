'use client';

import { useState, type ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { Terminal, Star, HelpCircle, Bug } from 'lucide-react';
import { useT } from '@/shared/lib/i18n/client';
import { AppModal } from '@/shared/ui';
import type { InquiryType } from '@/entities/inquiry';

const InquiryForm = dynamic(() => import('@/entities/inquiry').then((mod) => mod.InquiryForm), {
  loading: () => <div className="h-64 w-full animate-pulse rounded-xl bg-slate-900/50" />,
  ssr: false,
});

interface InquiryModalProps {
  children?: ReactNode;
  type?: InquiryType;
}

export const InquiryModal = ({ children, type = 'demo' }: InquiryModalProps) => {
  const { t } = useT('inquiry');
  const [isOpen, setIsOpen] = useState(false);

  const Icon = {
    demo: Terminal,
    review: Star,
    contact: HelpCircle,
    glitch: Bug,
  }[type];

  return (
    <AppModal
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      title={t(`${type}.title`)}
      description={t(`${type}.description`)}
      trigger={children}
      headerTitle={
        <>
          <Icon className="mt-0.5 h-5 w-5 shrink-0 text-[#2dd4bf] sm:mt-0" />
          <span className="font-mono text-[10px] leading-tight tracking-widest text-[#2dd4bf]/70 uppercase sm:text-xs">
            {t(`${type}.header`)}
          </span>
        </>
      }
    >
      {isOpen ? <InquiryForm type={type} /> : null}
    </AppModal>
  );
};
