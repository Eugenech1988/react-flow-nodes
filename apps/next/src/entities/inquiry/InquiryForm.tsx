'use client';

import { useState, useMemo } from 'react';
import { motion, Variants } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Mail, Building2, Send, CheckCircle2 } from 'lucide-react';

import { useT } from '@/shared/lib/i18n/client';
import { AppButton } from '@/shared/ui';
import { AppInput, AppLabel, AppTextarea } from '@/shared/ui/form-controls';

export type InquiryType = 'demo' | 'feedback' | 'contact';

export const demoRequestInputSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Invalid email address' }),
  company: z.string().min(2, { message: 'Company name is required' }),
  message: z.string().optional(),
});

const inputVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
};

export const InquiryForm = ({ type = 'demo' }: { type?: InquiryType }) => {
  const { t } = useT('inquiry');
  const [isSuccess, setIsSuccess] = useState(false);

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

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 flex flex-col items-center justify-center py-12 text-center"
      >
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-[#2dd4bf]/50 bg-[#2dd4bf]/10 shadow-[0_0_30px_rgba(45,212,191,0.2)]">
          <CheckCircle2 className="h-10 w-10 text-[#2dd4bf]" />
        </div>
        <h3 className="text-xl font-bold text-[#d1faf5]">{t(`form.modes.${type}.success`)}</h3>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="relative z-10 flex flex-col gap-4 sm:gap-5">
      <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2">
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
          pendingText={t(`form.modes.${type}.submitting`)}
          className="w-full sm:w-auto"
        >
          {t(`form.modes.${type}.submit`)}
        </AppButton>
      </motion.div>
    </form>
  );
};