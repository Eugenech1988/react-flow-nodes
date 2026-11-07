'use client';

import { useState, type ReactNode } from 'react';
import { Terminal, Star, HelpCircle, Bug } from 'lucide-react';
import { useT } from '@/shared/lib/i18n/client';
import { AppModal } from '@/shared/ui';
import { InquiryForm, type InquiryType } from '@/entities/inquiry';

interface InquiryModalProps {
  children?: ReactNode;
  type?: InquiryType;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const InquiryModal = ({
                               children,
                               type = 'demo',
                               isOpen: controlledIsOpen,
                               onOpenChange,
                             }: InquiryModalProps) => {
  const { t } = useT('inquiry');
  const [internalIsOpen, setInternalIsOpen] = useState(false);

  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;

  const handleOpenChange = (open: boolean) => {
    if (!isControlled) {
      setInternalIsOpen(open);
    }

    onOpenChange?.(open);
  };

  const Icon = {
    demo: Terminal,
    review: Star,
    contact: HelpCircle,
    glitch: Bug,
  }[type];

  return (
    <AppModal
      isOpen={isOpen}
      onOpenChange={handleOpenChange}
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
      {isOpen && <InquiryForm type={type} />}
    </AppModal>
  );
};