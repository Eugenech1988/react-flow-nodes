'use client';

import { useState, type ElementType } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Mail, Building2, Send, CheckCircle2 } from 'lucide-react';
import { useT } from '@/shared/lib/i18n/client';
import { AppButton, AppInput, AppLabel, AppTextarea, type ButtonVariant } from '@/shared/ui';
import type { TInquiryType } from './types';

const baseSchema = z.object({
  name: z.string(),
  email: z.string(),
  company: z.string(),
  message: z.string().optional(),
});

type FormValues = z.infer<typeof baseSchema>;

interface IInquiryFormProps {
  type?: TInquiryType;
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

  const localizedSchema = z.object({
    name: z.string().min(2, { message: t('form.errors.name') }),
    email: z.email({ message: t('form.errors.email') }),
    company: z.string().min(2, { message: t('form.errors.company') }),
    message: z.string().optional(),
  });

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
      <div className="animate-in fade-in zoom-in-95 relative z-10 flex flex-col items-center justify-center py-12 text-center duration-300">
        <div
          className={`mb-6 flex h-20 w-20 items-center justify-center rounded-full border shadow-[0_0_30px_rgba(45,212,191,0.2)] ${
            isSteampunk
              ? 'border-[#6fa28c]/50 bg-[#6fa28c]/10'
              : 'border-[#2dd4bf]/50 bg-[#2dd4bf]/10'
          }`}
        >
          <CheckCircle2
            className={`h-10 w-10 ${isSteampunk ? 'text-[#6fa28c]' : 'text-[#2dd4bf]'}`}
          />
        </div>
        <h3
          className={`text-xl font-bold ${
            isSteampunk ? 'font-typewriter text-[#d4cfc0]' : 'text-[#d1faf5]'
          }`}
        >
          {t(`form.modes.${type}.success`)}
        </h3>
      </div>
    );
  }

  const inputBaseStyles = isSteampunk
    ? 'rounded-sm font-typewriter shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] bg-[#0a0e0d]/50'
    : '';

  const inputErrorStyles = isSteampunk
    ? 'border-[#c25a5a] text-[#c25a5a] placeholder:text-[#c25a5a]/60 focus-visible:border-[#c25a5a] focus-visible:ring-[#c25a5a]/50'
    : '';

  const inputDefaultStyles = isSteampunk
    ? 'border-[#2f3d36] text-[#d4cfc0] placeholder:text-[#4a5c52] focus-visible:border-[#6fa28c] focus-visible:ring-[#6fa28c]/50'
    : '';

  const getInputStyles = (hasError: boolean) =>
    `${inputBaseStyles} ${hasError ? inputErrorStyles : inputDefaultStyles}`;

  const labelStyles = isSteampunk
    ? 'font-typewriter text-[10px] tracking-widest text-[#6fa28c] uppercase'
    : '';

  const iconStyles = isSteampunk ? 'text-[#4a5c52]' : 'text-slate-500';

  const errorStyles = isSteampunk
    ? 'font-typewriter text-xs text-[#c25a5a]'
    : 'font-mono text-xs text-red-400';

  const iconClass = (hasError: boolean) =>
    `absolute top-1/2 left-3 z-10 h-4 w-4 -translate-y-1/2 ${
      hasError ? (isSteampunk ? 'text-[#c25a5a]' : 'text-red-400') : iconStyles
    }`;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="relative z-10 flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2">
        <div className="animate-in fade-in slide-in-from-left-4 flex flex-col gap-2 duration-500">
          <AppLabel htmlFor="name" className={labelStyles}>
            {t('form.name')}
          </AppLabel>
          <div className="relative">
            <User className={iconClass(!!errors.name)} />
            <AppInput
              id="name"
              placeholder={t('form.placeholderName')}
              className={`pl-10 ${getInputStyles(!!errors.name)}`}
              error={!!errors.name}
              {...register('name')}
            />
          </div>
          {errors.name && <p className={errorStyles}>{errors.name.message}</p>}
        </div>

        <div
          className="animate-in fade-in slide-in-from-left-4 flex flex-col gap-2 duration-500"
          style={{ animationDelay: '50ms', animationFillMode: 'both' }}
        >
          <AppLabel htmlFor="email" className={labelStyles}>
            {t('form.email')}
          </AppLabel>
          <div className="relative">
            <Mail className={iconClass(!!errors.email)} />
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
        </div>
      </div>

      <div
        className="animate-in fade-in slide-in-from-left-4 flex flex-col gap-2 duration-500"
        style={{ animationDelay: '100ms', animationFillMode: 'both' }}
      >
        <AppLabel htmlFor="company" className={labelStyles}>
          {t('form.company')}
        </AppLabel>
        <div className="relative">
          <Building2 className={iconClass(!!errors.company)} />
          <AppInput
            id="company"
            placeholder={t('form.placeholderCompany')}
            className={`pl-10 ${getInputStyles(!!errors.company)}`}
            error={!!errors.company}
            {...register('company')}
          />
        </div>
        {errors.company && <p className={errorStyles}>{errors.company.message}</p>}
      </div>

      <div
        className="animate-in fade-in slide-in-from-left-4 flex flex-col gap-2 duration-500"
        style={{ animationDelay: '150ms', animationFillMode: 'both' }}
      >
        <AppLabel htmlFor="message" className={labelStyles}>
          {t('form.message')}
        </AppLabel>
        <AppTextarea
          id="message"
          rows={3}
          placeholder={t(`form.modes.${type}.placeholderMessage`)}
          className={getInputStyles(!!errors.message)}
          error={!!errors.message}
          {...register('message')}
        />
        {errors.message && <p className={errorStyles}>{errors.message.message}</p>}
      </div>

      <div
        className={`animate-in fade-in slide-in-from-left-4 mt-4 flex justify-end pt-5 duration-500 ${
          isSteampunk ? 'border-t border-[#2f3d36]/50' : ''
        }`}
        style={{ animationDelay: '200ms', animationFillMode: 'both' }}
      >
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
      </div>
    </form>
  );
};