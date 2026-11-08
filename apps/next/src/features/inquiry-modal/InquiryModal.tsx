'use client';

import { useState, type ElementType, type ReactNode } from 'react';
import dynamic from 'next/dynamic';
import type { TInquiryType, TInquiryTheme } from '@/entities/inquiry';

const loadDialog = () => import('./InquiryDialog');

const InquiryDialog = dynamic(() => loadDialog().then((mod) => mod.InquiryDialog), {
  ssr: false,
});

interface IInquiryModalProps {
  children?: ReactNode;
  type?: TInquiryType;
  theme?: TInquiryTheme;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  submitIcon?: ElementType;
}

export const InquiryModal = ({
                               children,
                               type = 'demo',
                               theme = 'default',
                               isOpen: controlledIsOpen,
                               onOpenChange,
                               submitIcon,
                             }: IInquiryModalProps) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [wasOpened, setWasOpened] = useState(false);

  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;

  const handleOpenChange = (open: boolean) => {
    if (open) setWasOpened(true);
    if (!isControlled) setInternalIsOpen(open);
    onOpenChange?.(open);
  };

  return (
    <>
      {children && (
        <span
          className="contents"
          onClick={() => handleOpenChange(true)}
          onPointerEnter={loadDialog}
          onFocus={loadDialog}
        >
          {children}
        </span>
      )}

      {(wasOpened || isOpen) && (
        <InquiryDialog
          type={type}
          theme={theme}
          isOpen={isOpen}
          onOpenChange={handleOpenChange}
          submitIcon={submitIcon}
        />
      )}
    </>
  );
};