'use client';

import { useState, type ReactNode } from 'react';
import { Terminal, MessageSquare, HelpCircle } from 'lucide-react';
import { useT } from '@/shared/lib/i18n/client';
import { AppModal } from '@/shared/ui';
import { InquiryForm } from '@/entities/inquiry';

export type InquiryType = 'demo' | 'review' | 'contact';

interface InquiryModalProps {
  children?: ReactNode;
  type?: InquiryType;
}

export const InquiryModal = ({ children, type = 'demo' }: InquiryModalProps) => {
  const { t } = useT('inquiry');
  const [isOpen, setIsOpen] = useState(false);

  const Icon = {
    demo: Terminal,
    review: MessageSquare,
    contact: HelpCircle,
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
      <InquiryForm type={type} />
    </AppModal>
  );
};
