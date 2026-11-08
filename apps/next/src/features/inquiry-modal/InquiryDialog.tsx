'use client';

import type { ElementType } from 'react';
import { Terminal, Star, HelpCircle, Bug, X } from 'lucide-react';
import { useT } from '@/shared/lib/i18n/client';
import { AppModal } from '@/shared/ui/app-modal';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@pipeline/ui/dialog';
import { InquiryForm } from '@/entities/inquiry/InquiryForm';
import type { TInquiryType, TInquiryTheme } from '@/entities/inquiry';

interface IInquiryDialogProps {
  type: TInquiryType;
  theme: TInquiryTheme;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  submitIcon?: ElementType;
}

const icons = {
  demo: Terminal,
  review: Star,
  contact: HelpCircle,
  glitch: Bug,
};

const rivets = ['top-3 left-3', 'top-3 right-3', 'bottom-3 left-3', 'bottom-3 right-3'] as const;

export const InquiryDialog = ({
  type,
  theme,
  isOpen,
  onOpenChange,
  submitIcon,
}: IInquiryDialogProps) => {
  const { t } = useT('inquiry');
  const Icon = icons[type];

  if (theme === 'steampunk') {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[90dvh] w-[95vw] max-w-xl overflow-y-auto border-none bg-transparent p-0 shadow-none sm:max-w-2xl [&>button]:hidden">
          <DialogTitle className="sr-only">{t(`${type}.title`)}</DialogTitle>
          <DialogDescription className="sr-only">{t(`${type}.description`)}</DialogDescription>

          <div className="animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4 relative w-full overflow-hidden rounded-2xl border-2 border-[#4a5c52] bg-linear-to-b from-[#1a2420] to-[#0f1512] p-3 shadow-[inset_0_1px_0_rgba(156,196,176,0.15),0_20px_50px_rgba(0,0,0,0.8)] duration-300 sm:rounded-3xl sm:p-4">
            {rivets.map((pos) => (
              <span
                key={pos}
                className={`absolute ${pos} z-20 h-2 w-2 rounded-full bg-[#3a4842] shadow-[inset_0_1px_1px_rgba(156,196,176,0.25),inset_0_-1px_1px_rgba(0,0,0,0.8)]`}
              />
            ))}

            <div className="relative flex flex-col overflow-hidden rounded-xl border border-[#2f3d36] bg-[#0a0e0d] shadow-[inset_0_0_40px_rgba(0,0,0,0.9),inset_0_0_8px_rgba(111,162,140,0.1)]">
              <div className="pointer-events-none absolute inset-0 z-20 bg-[repeating-linear-gradient(0deg,transparent_0,transparent_2px,rgba(111,162,140,0.03)_2px,rgba(111,162,140,0.03)_3px)]" />
              <div className="pointer-events-none absolute inset-0 z-20 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.6)_100%)]" />

              <div className="relative z-10 flex items-center justify-between border-b border-[#2f3d36] bg-[#0f1512]/80 px-4 py-3 sm:px-6">
                <div className="flex items-center gap-2 font-mono text-[10px] font-bold tracking-widest text-[#6fa28c] uppercase sm:text-xs">
                  <Icon className="h-4 w-4" />
                  <span>{t(`${type}.header`)}</span>
                </div>
                <DialogClose className="relative z-30 cursor-pointer rounded-full p-1 text-[#8a9488] transition-colors hover:bg-[#6fa28c]/10 hover:text-[#9cc4b0]">
                  <X className="h-4 w-4" />
                </DialogClose>
              </div>

              <div className="relative z-10 px-4 py-6 sm:px-8 sm:py-8">
                {isOpen && (
                  <InquiryForm type={type} submitVariant="steampunk" submitIcon={submitIcon} />
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <AppModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title={t(`${type}.title`)}
      description={t(`${type}.description`)}
      headerTitle={
        <>
          <Icon className="mt-0.5 h-5 w-5 shrink-0 text-[#2dd4bf] sm:mt-0" />
          <span className="font-mono text-[10px] leading-tight tracking-widest text-[#2dd4bf]/70 uppercase sm:text-xs">
            {t(`${type}.header`)}
          </span>
        </>
      }
    >
      {isOpen && <InquiryForm type={type} submitVariant="primary" submitIcon={submitIcon} />}
    </AppModal>
  );
};
