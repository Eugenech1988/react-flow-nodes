'use client';

import type { ReactElement, ReactNode } from 'react';
import { X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@pipeline/ui/dialog';
import { cn } from '@/shared/lib';

interface AppModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
  title: string;
  description: string;
  headerTitle?: ReactNode;
  className?: string;
  trigger?: ReactNode;
}

export const AppModal = ({
  isOpen,
  onOpenChange,
  children,
  title,
  description,
  headerTitle,
  className,
  trigger,
}: AppModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger render={trigger as ReactElement} />}

      <DialogContent
        className={cn(
          'max-h-[90dvh] w-[95vw] max-w-2xl overflow-y-auto border-none bg-transparent p-0 shadow-none sm:max-w-3xl [&>button]:hidden',
          className,
        )}
      >
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <DialogDescription className="sr-only">{description}</DialogDescription>

        <div className="animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4 border-theme-accent/30 bg-theme-surface/95 shadow-theme-frame relative w-full overflow-hidden rounded-3xl border p-1.5 duration-300 sm:p-2">
          <div className="border-theme-line bg-theme-bg relative flex flex-col overflow-hidden rounded-[1.4rem] border p-4 sm:p-8">
            <div className="theme-grid pointer-events-none absolute inset-0 bg-size-[2rem_2rem]" />

            <DialogClose className="text-theme-muted hover:bg-theme-panel hover:text-theme-fg absolute top-4 right-4 z-20 rounded-full p-1.5 transition-colors sm:top-6 sm:right-6">
              <X className="h-5 w-5" />
            </DialogClose>

            {headerTitle && (
              <div className="border-theme-line relative z-10 mb-6 flex items-start gap-3 border-b pr-10 pb-4 sm:items-center">
                {headerTitle}
              </div>
            )}

            <div className="relative z-10">{children}</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
