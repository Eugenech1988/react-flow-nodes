'use client';

import type { ElementType } from 'react';
import { Terminal, Star, HelpCircle, Bug, X } from 'lucide-react';
import { useT } from '@/shared/lib/i18n/client';
import { AppModal } from '@/shared/ui/AppModal';
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

  if (theme === 'careers') {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent
          data-theme="careers"
          className="max-h-[90dvh] w-[95vw] max-w-xl overflow-y-auto border-none bg-transparent p-0 shadow-none sm:max-w-2xl [&>button]:hidden"
        >
          <DialogTitle className="sr-only">{t(`${type}.title`)}</DialogTitle>
          <DialogDescription className="sr-only">{t(`${type}.description`)}</DialogDescription>

          <div className="border-theme-line-strong from-theme-panel to-theme-surface animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4 relative w-full overflow-hidden rounded-2xl border-2 bg-linear-to-b p-3 shadow-[inset_0_1px_0_color-mix(in_oklab,var(--theme-accent-hover)_15%,transparent),0_20px_50px_rgba(0,0,0,0.8)] duration-300 sm:rounded-3xl sm:p-4">
            {rivets.map((pos) => (
              <span
                key={pos}
                className={`bg-theme-rivet absolute ${pos} z-20 h-2 w-2 rounded-full shadow-[inset_0_1px_1px_color-mix(in_oklab,var(--theme-accent-hover)_25%,transparent),inset_0_-1px_1px_rgba(0,0,0,0.8)]`}
              />
            ))}

            <div className="border-theme-line bg-theme-bg relative flex flex-col overflow-hidden rounded-xl border shadow-[inset_0_0_40px_rgba(0,0,0,0.9),inset_0_0_8px_color-mix(in_oklab,var(--theme-accent)_10%,transparent)]">
              <div className="pointer-events-none absolute inset-0 z-20 bg-[repeating-linear-gradient(0deg,transparent_0,transparent_2px,color-mix(in_oklab,var(--theme-accent)_3%,transparent)_2px,color-mix(in_oklab,var(--theme-accent)_3%,transparent)_3px)]" />
              <div className="pointer-events-none absolute inset-0 z-20 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.6)_100%)]" />

              <div className="border-theme-line bg-theme-surface/80 relative z-10 flex items-center justify-between border-b px-4 py-3 sm:px-6">
                <div className="text-theme-accent flex items-center gap-2 font-mono text-[10px] font-bold tracking-widest uppercase sm:text-xs">
                  <Icon className="h-4 w-4" />
                  <span>{t(`${type}.header`)}</span>
                </div>
                <DialogClose className="text-theme-muted hover:bg-theme-accent/10 hover:text-theme-accent-hover relative z-30 cursor-pointer rounded-full p-1 transition-colors">
                  <X className="h-4 w-4" />
                </DialogClose>
              </div>

              <div className="relative z-10 px-4 py-6 sm:px-8 sm:py-8">
                {isOpen && (
                  <InquiryForm type={type} submitVariant="careers" submitIcon={submitIcon} />
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
          <Icon className="text-theme-accent mt-0.5 h-5 w-5 shrink-0 sm:mt-0" />
          <span className="text-theme-accent/70 font-mono text-[10px] leading-tight tracking-widest uppercase sm:text-xs">
            {t(`${type}.header`)}
          </span>
        </>
      }
    >
      {isOpen && <InquiryForm type={type} submitVariant="primary" submitIcon={submitIcon} />}
    </AppModal>
  );
};
