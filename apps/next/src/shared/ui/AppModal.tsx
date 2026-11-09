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

        <div className="animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4 relative w-full overflow-hidden rounded-3xl border border-[#2dd4bf]/30 bg-[#0a1210]/95 p-1.5 shadow-[inset_0_0_50px_rgba(0,0,0,0.8),0_20px_40px_rgba(0,0,0,0.8)] backdrop-blur-xl duration-300 sm:p-2">
          <div className="relative flex flex-col overflow-hidden rounded-[1.4rem] border border-slate-800 bg-[#06100f] p-4 sm:p-8">
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(45,212,191,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(45,212,191,0.03)_1px,transparent_1px)] bg-size-[2rem_2rem]" />

            <DialogClose className="absolute top-4 right-4 z-20 rounded-full p-1.5 text-slate-400 transition-colors hover:bg-white/5 hover:text-white sm:top-6 sm:right-6">
              <X className="h-5 w-5" />
            </DialogClose>

            {headerTitle && (
              <div className="relative z-10 mb-6 flex items-start gap-3 border-b border-slate-800/80 pr-10 pb-4 sm:items-center">
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
