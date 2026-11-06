'use client';

import { useState, useMemo, type ReactNode } from 'react';
import { motion, type Variants } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Mail, Building2, Send, Terminal, CheckCircle2, X } from 'lucide-react';

import { useT } from '@/shared/lib/i18n/client';
import { AppButton } from '@/shared/ui';
import { AppInput, AppLabel, AppTextarea } from '@/shared/ui/form-controls';

export const demoRequestInputSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Invalid email address' }),
  company: z.string().min(2, { message: 'Company name is required' }),
  message: z.string().optional(),
});

import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@pipeline/ui';

const formVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 80, damping: 20, staggerChildren: 0.1 },
  },
};

const inputVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
};

interface RequestDemoModalProps {
  children?: ReactNode;
}

export const RequestDemoModal = ({ children }: RequestDemoModalProps) => {
  const { t } = useT('request-demo');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const localizedSchema = useMemo(
    () =>
      demoRequestInputSchema.extend({
        name: demoRequestInputSchema.shape.name.min(2, { message: t('form.errors.name') }),
        email: demoRequestInputSchema.shape.email.email({ message: t('form.errors.email') }),
        company: demoRequestInputSchema.shape.company.min(2, { message: t('form.errors.company') }),
      }),
    [t]
  );

  type FormValues = z.infer<typeof localizedSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(localizedSchema),
    defaultValues: {
      name: '',
      email: '',
      company: '',
      message: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log('Form Submitted:', data);
    setIsSuccess(true);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setTimeout(() => {
        setIsSuccess(false);
        reset();
      }, 300);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger render={children as React.ReactElement} />

      <DialogContent
        className="max-w-2xl border-none bg-transparent p-0 shadow-none sm:max-w-3xl [&>button]:hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 duration-200"
      >
        <DialogTitle className="sr-only">{t('title')}</DialogTitle>
        <DialogDescription className="sr-only">{t('description')}</DialogDescription>

        <motion.div
          variants={formVariants}
          initial="hidden"
          animate="visible"
          className="relative w-full overflow-hidden rounded-3xl border border-[#2dd4bf]/30 bg-[#0a1210]/95 p-1.5 shadow-[inset_0_0_50px_rgba(0,0,0,0.8),0_20px_40px_rgba(0,0,0,0.8)] backdrop-blur-xl sm:p-2"
        >
          <span className="absolute top-3 left-3 h-1.5 w-1.5 rounded-full bg-slate-700 shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)] sm:top-4 sm:left-4 sm:h-2 sm:w-2" />
          <span className="absolute top-3 right-3 h-1.5 w-1.5 rounded-full bg-slate-700 shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)] sm:top-4 sm:right-4 sm:h-2 sm:w-2" />
          <span className="absolute bottom-3 left-3 h-1.5 w-1.5 rounded-full bg-slate-700 shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)] sm:bottom-4 sm:left-4 sm:h-2 sm:w-2" />
          <span className="absolute right-3 bottom-3 h-1.5 w-1.5 rounded-full bg-slate-700 shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)] sm:right-4 sm:bottom-4 sm:h-2 sm:w-2" />

          <div className="relative flex flex-col overflow-hidden rounded-[1.4rem] border border-slate-800 bg-[#06100f] p-6 sm:p-8">
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(45,212,191,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(45,212,191,0.03)_1px,transparent_1px)] bg-size-[2rem_2rem]" />

            <DialogClose className="absolute cursor-pointer top-4 right-4 z-20 rounded-full p-1.5 text-slate-400 transition-colors hover:bg-white/5 hover:text-white">
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </DialogClose>

            <div className="relative z-10 mb-6 flex items-center gap-3 border-b border-slate-800/80 pb-4">
              <Terminal className="h-5 w-5 text-[#2dd4bf]" />
              <span className="font-mono text-xs uppercase tracking-widest text-[#2dd4bf]/70">
                Connection Setup // SECURE CHANNEL
              </span>
            </div>

            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative z-10 flex flex-col items-center justify-center py-12 text-center"
              >
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-[#2dd4bf]/50 bg-[#2dd4bf]/10 shadow-[0_0_30px_rgba(45,212,191,0.2)]">
                  <CheckCircle2 className="h-10 w-10 text-[#2dd4bf]" />
                </div>
                <h3 className="text-xl font-bold text-[#d1faf5]">{t('form.success')}</h3>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="relative z-10 flex flex-col gap-5">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <motion.div variants={inputVariants} className="flex flex-col gap-2">
                    <AppLabel htmlFor="name">{t('form.name')}</AppLabel>
                    <div className="relative">
                      <User className={`absolute top-1/2 left-3 z-10 h-4 w-4 -translate-y-1/2 ${errors.name ? 'text-red-400' : 'text-slate-500'}`} />
                      <AppInput
                        id="name"
                        placeholder={t('form.placeholderName')}
                        className="pl-10"
                        error={!!errors.name}
                        {...register('name')}
                      />
                    </div>
                    {errors.name && (
                      <p className="font-mono text-xs text-red-400">{errors.name.message}</p>
                    )}
                  </motion.div>

                  <motion.div variants={inputVariants} className="flex flex-col gap-2">
                    <AppLabel htmlFor="email">{t('form.email')}</AppLabel>
                    <div className="relative">
                      <Mail className={`absolute top-1/2 left-3 z-10 h-4 w-4 -translate-y-1/2 ${errors.email ? 'text-red-400' : 'text-slate-500'}`} />
                      <AppInput
                        id="email"
                        type="email"
                        placeholder={t('form.placeholderEmail')}
                        className="pl-10"
                        error={!!errors.email}
                        {...register('email')}
                      />
                    </div>
                    {errors.email && (
                      <p className="font-mono text-xs text-red-400">{errors.email.message}</p>
                    )}
                  </motion.div>
                </div>

                <motion.div variants={inputVariants} className="flex flex-col gap-2">
                  <AppLabel htmlFor="company">{t('form.company')}</AppLabel>
                  <div className="relative">
                    <Building2 className={`absolute top-1/2 left-3 z-10 h-4 w-4 -translate-y-1/2 ${errors.company ? 'text-red-400' : 'text-slate-500'}`} />
                    <AppInput
                      id="company"
                      placeholder={t('form.placeholderCompany')}
                      className="pl-10"
                      error={!!errors.company}
                      {...register('company')}
                    />
                  </div>
                  {errors.company && (
                    <p className="font-mono text-xs text-red-400">{errors.company.message}</p>
                  )}
                </motion.div>

                <motion.div variants={inputVariants} className="flex flex-col gap-2">
                  <AppLabel htmlFor="message">{t('form.message')}</AppLabel>
                  <AppTextarea
                    id="message"
                    rows={3}
                    placeholder={t('form.placeholderMessage')}
                    error={!!errors.message}
                    {...register('message')}
                  />
                  {errors.message && (
                    <p className="font-mono text-xs text-red-400">{errors.message.message}</p>
                  )}
                </motion.div>

                <motion.div variants={inputVariants} className="mt-2 flex justify-end">
                  <AppButton
                    type="submit"
                    variant="primary"
                    size="lg"
                    icon={Send}
                    isDisabled={isSubmitting}
                    isPending={isSubmitting}
                    pendingText={t('form.submitting')}
                  >
                    {t('form.submit')}
                  </AppButton>
                </motion.div>
              </form>
            )}
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};