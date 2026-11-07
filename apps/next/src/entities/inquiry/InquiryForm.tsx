'use client';

import { useState, type ElementType } from 'react';
import { m, Variants } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Mail, Building2, Send, CheckCircle2 } from 'lucide-react';

import { useT } from '@/shared/lib/i18n/client';
import { AppButton, AppInput, AppLabel, AppTextarea, type ButtonVariant } from '@/shared/ui';

export type InquiryType = 'demo' | 'review' | 'contact' | 'glitch';

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

interface IInquiryFormProps {
  type?: InquiryType;
  submitVariant?: ButtonVariant;
  submitIcon?: ElementType;
}

export const InquiryForm = ({
                              type = 'demo',
                              submitVariant = 'primary',
                              submitIcon = Send,
                            }: IInquiryFormProps) => {
  const { t } = useT('inquiry');
  const [isSuccess, setIsSuccess] = useState(false);

  const isSteampunk = submitVariant === 'steampunk' || submitVariant === 'steampunk-outline';

  const localizedSchema = demoRequestInputSchema.extend({
    name: demoRequestInputSchema.shape.name.min(2, { message: t('form.errors.name') }),
    email: demoRequestInputSchema.shape.email.email({ message: t('form.errors.email') }),
    company: demoRequestInputSchema.shape.company.min(2, { message: t('form.errors.company') }),
  });

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
      <m.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 flex flex-col items-center justify-center py-12 text-center"
      >
        <div className={`mb-6 flex h-20 w-20 items-center justify-center rounded-full border shadow-[0_0_30px_rgba(45,212,191,0.2)] ${isSteampunk ? 'border-[#6fa28c]/50 bg-[#6fa28c]/10' : 'border-[#2dd4bf]/50 bg-[#2dd4bf]/10'}`}>
          <CheckCircle2 className={`h-10 w-10 ${isSteampunk ? 'text-[#6fa28c]' : 'text-[#2dd4bf]'}`} />
        </div>
        <h3 className={`text-xl font-bold ${isSteampunk ? 'font-typewriter text-[#d4cfc0]' : 'text-[#d1faf5]'}`}>
          {t(`form.modes.${type}.success`)}
        </h3>
      </m.div>
    );
  }

  // Базовые стили для стимпанк-инпутов (без цветов текста и рамки)
  const inputBaseStyles = isSteampunk
    ? "rounded-sm font-typewriter shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] bg-[#0a0e0d]/50"
    : "";

  // Стили при ошибке
  const inputErrorStyles = isSteampunk
    ? "border-[#c25a5a] text-[#c25a5a] placeholder:text-[#c25a5a]/60 focus-visible:border-[#c25a5a] focus-visible:ring-[#c25a5a]/50"
    : "";

  // Стили в обычном состоянии
  const inputDefaultStyles = isSteampunk
    ? "border-[#2f3d36] text-[#d4cfc0] placeholder:text-[#4a5c52] focus-visible:border-[#6fa28c] focus-visible:ring-[#6fa28c]/50"
    : "";

  const getInputStyles = (hasError: boolean) =>
    `${inputBaseStyles} ${hasError ? inputErrorStyles : inputDefaultStyles}`;

  const labelStyles = isSteampunk
    ? "font-typewriter text-[10px] tracking-widest text-[#6fa28c] uppercase"
    : "";

  const iconStyles = isSteampunk
    ? "text-[#4a5c52]"
    : "text-slate-500";

  const errorStyles = isSteampunk ? "font-typewriter text-[#c25a5a]" : "font-mono text-red-400";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="relative z-10 flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2">
        <m.div variants={inputVariants} className="flex flex-col gap-2">
          <AppLabel htmlFor="name" className={labelStyles}>{t('form.name')}</AppLabel>
          <div className="relative">
            <User
              className={`absolute top-1/2 left-3 z-10 h-4 w-4 -translate-y-1/2 ${errors.name ? 'text-[#c25a5a]' : iconStyles}`}
            />
            <AppInput
              id="name"
              placeholder={t('form.placeholderName')}
              className={`pl-10 ${getInputStyles(!!errors.name)}`}
              error={!!errors.name}
              {...register('name')}
            />
          </div>
          {errors.name && <p className={errorStyles}>{errors.name.message}</p>}
        </m.div>

        <m.div variants={inputVariants} className="flex flex-col gap-2">
          <AppLabel htmlFor="email" className={labelStyles}>{t('form.email')}</AppLabel>
          <div className="relative">
            <Mail
              className={`absolute top-1/2 left-3 z-10 h-4 w-4 -translate-y-1/2 ${errors.email ? 'text-[#c25a5a]' : iconStyles}`}
            />
            <AppInput
              id="email"
              type="email"
              placeholder={t('form.placeholderEmail')}
              className={`pl-10 ${getInputStyles(!!errors.email)}`}
              error={!!errors.email}
              {...register('email')}
            />
          </div>
          {errors.email && <p className={errorStyles}>{errors.email.message}</p>}
        </m.div>
      </div>

      <m.div variants={inputVariants} className="flex flex-col gap-2">
        <AppLabel htmlFor="company" className={labelStyles}>{t('form.company')}</AppLabel>
        <div className="relative">
          <Building2
            className={`absolute top-1/2 left-3 z-10 h-4 w-4 -translate-y-1/2 ${errors.company ? 'text-[#c25a5a]' : iconStyles}`}
          />
          <AppInput
            id="company"
            placeholder={t('form.placeholderCompany')}
            className={`pl-10 ${getInputStyles(!!errors.company)}`}
            error={!!errors.company}
            {...register('company')}
          />
        </div>
        {errors.company && (
          <p className={errorStyles}>{errors.company.message}</p>
        )}
      </m.div>

      <m.div variants={inputVariants} className="flex flex-col gap-2">
        <AppLabel htmlFor="message" className={labelStyles}>{t('form.message')}</AppLabel>
        <AppTextarea
          id="message"
          rows={3}
          placeholder={t(`form.modes.${type}.placeholderMessage`)}
          className={getInputStyles(!!errors.message)}
          error={!!errors.message}
          {...register('message')}
        />
        {errors.message && (
          <p className={errorStyles}>{errors.message.message}</p>
        )}
      </m.div>

      <m.div variants={inputVariants} className={`mt-4 flex justify-end pt-5 ${isSteampunk ? 'border-t border-[#2f3d36]/50' : ''}`}>
        <AppButton
          type="submit"
          variant={submitVariant}
          size="lg"
          icon={submitIcon}
          isDisabled={isSubmitting}
          isPending={isSubmitting}
          pendingText={t(`form.modes.${type}.submitting`)}
          className="w-full sm:w-auto"
        >
          {t(`form.modes.${type}.submit`)}
        </AppButton>
      </m.div>
    </form>
  );
};