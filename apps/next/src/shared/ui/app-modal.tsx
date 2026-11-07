'use client';

import { type ReactNode } from 'react';
import { motion, Variants } from 'framer-motion';
import { X } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription, DialogClose } from '@pipeline/ui';
import { cn } from '@/shared/lib';

const modalVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 80, damping: 20 },
  },
};

interface AppModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
  title: string;
  description: string;
  headerTitle?: ReactNode;
  className?: string;
  trigger?: ReactNode; // <--- Добавили пропс для кнопки
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
      {/* Рендерим триггер ВНУТРИ Dialog */}
      {trigger && <DialogTrigger render={trigger as React.ReactElement} />}

      <DialogContent
        className={cn(
          'w-[95vw] max-w-2xl max-h-[90dvh] overflow-y-auto border-none bg-transparent p-0 shadow-none sm:max-w-3xl [&>button]:hidden',
          'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 duration-200',
          className,
        )}
      >
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <DialogDescription className="sr-only">{description}</DialogDescription>

        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          className="relative w-full overflow-hidden rounded-3xl border border-[#2dd4bf]/30 bg-[#0a1210]/95 p-1.5 shadow-[inset_0_0_50px_rgba(0,0,0,0.8),0_20px_40px_rgba(0,0,0,0.8)] backdrop-blur-xl sm:p-2"
        >
          {/* ... заклепки ... */}
          <div className="relative flex flex-col overflow-hidden rounded-[1.4rem] border border-slate-800 bg-[#06100f] p-4 sm:p-8">
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(45,212,191,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(45,212,191,0.03)_1px,transparent_1px)] bg-size-[2rem_2rem]" />

            <DialogClose className="absolute top-4 right-4 z-20 rounded-full p-1.5 text-slate-400 transition-colors hover:bg-white/5 hover:text-white sm:top-6 sm:right-6">
              <X className="h-5 w-5" />
            </DialogClose>

            {headerTitle && (
              <div className="relative z-10 mb-6 flex items-start gap-3 border-b border-slate-800/80 pb-4 pr-10 sm:items-center">
                {headerTitle}
              </div>
            )}

            <div className="relative z-10">{children}</div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};