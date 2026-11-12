'use client';

import { useState, type ElementType } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Mail, Building2, Send, CheckCircle2, Briefcase } from 'lucide-react';
import { useT } from '@/shared/lib/i18n/client';
import { AppButton, AppInput, AppLabel, AppTextarea, type ButtonVariant } from '@/shared/ui';
import { sendInquiry } from '@/shared/api/mail';
import { sendInquiryInputSchema, type TInquiryTypeData } from '@pipeline/contracts';

interface IInquiryFormProps {
  type?: TInquiryTypeData;
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
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isCareers = submitVariant === 'careers';
  const formTheme = isCareers ? 'careers' : 'default';

  const localizedSchema = sendInquiryInputSchema.extend({
    name: z.string().min(2, { message: t('form.errors.name') }),
    email: z.string().email({ message: t('form.errors.email') }),
    company: z.string().min(2, { message: t('form.errors.company') }),
    position: z.string().min(2, { message: t('form.errors.position') }),
    message: z.string().min(10, { message: t('form.errors.message') }),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.input<typeof localizedSchema>, unknown, z.output<typeof localizedSchema>>({
    resolver: zodResolver(localizedSchema),
    defaultValues: {
      name: '',
      email: '',
      company: '',
      position: '',
      message: '',
      type,
    },
  });

  const onSubmit = async (data: z.output<typeof localizedSchema>) => {
    setErrorMsg(null);

    const success = await sendInquiry(data);

    if (success) {
      setIsSuccess(true);
    } else {
      setErrorMsg(
        t('form.errors.submitFailed', {
          defaultValue: 'Failed to send request. Please try again.',
        }),
      );
    }
  };

  if (isSuccess) {
    return (
      <div className="animate-in fade-in zoom-in-95 relative z-10 flex flex-col items-center justify-center py-12 text-center duration-300">
        <div className="border-theme-accent/50 bg-theme-accent/10 mb-6 flex h-20 w-20 items-center justify-center rounded-full border shadow-[0_0_30px_color-mix(in_oklab,var(--theme-accent)_20%,transparent)]">
          <CheckCircle2 className="text-theme-accent h-10 w-10" />
        </div>
        <h3 className="text-theme-fg text-xl font-bold">{t(`form.modes.${type}.success`)}</h3>
      </div>
    );
  }

  const iconClass = (hasError: boolean) =>
    `absolute top-1/2 left-3 z-10 h-4 w-4 -translate-y-1/2 ${
      hasError ? 'text-theme-danger' : 'text-theme-dim'
    }`;

  const errorStyles = 'text-theme-danger font-mono text-xs';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="relative z-10 flex flex-col gap-5">
      {errorMsg && (
        <div className="border-theme-danger/50 bg-theme-danger/10 text-theme-danger rounded-md border p-3 text-sm">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2">
        <div className="animate-in fade-in slide-in-from-left-4 flex flex-col gap-2 duration-500">
          <AppLabel htmlFor="name" theme={formTheme}>
            {t('form.name')}
          </AppLabel>
          <div className="relative">
            <User className={iconClass(!!errors.name)} />
            <AppInput
              id="name"
              theme={formTheme}
              placeholder={t('form.placeholderName')}
              className="pl-10"
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
          <AppLabel htmlFor="email" theme={formTheme}>
            {t('form.email')}
          </AppLabel>
          <div className="relative">
            <Mail className={iconClass(!!errors.email)} />
            <AppInput
              id="email"
              type="email"
              theme={formTheme}
              placeholder={t('form.placeholderEmail')}
              className="pl-10"
              error={!!errors.email}
              {...register('email')}
            />
          </div>
          {errors.email && <p className={errorStyles}>{errors.email.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2">
        <div
          className="animate-in fade-in slide-in-from-left-4 flex flex-col gap-2 duration-500"
          style={{ animationDelay: '100ms', animationFillMode: 'both' }}
        >
          <AppLabel htmlFor="company" theme={formTheme}>
            {t('form.company')}
          </AppLabel>
          <div className="relative">
            <Building2 className={iconClass(!!errors.company)} />
            <AppInput
              id="company"
              theme={formTheme}
              placeholder={t('form.placeholderCompany')}
              className="pl-10"
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
          <AppLabel htmlFor="position" theme={formTheme}>
            {t('form.position')}
          </AppLabel>
          <div className="relative">
            <Briefcase className={iconClass(!!errors.position)} />
            <AppInput
              id="position"
              theme={formTheme}
              placeholder={t('form.placeholderPosition')}
              className="pl-10"
              error={!!errors.position}
              {...register('position')}
            />
          </div>
          {errors.position && <p className={errorStyles}>{errors.position.message}</p>}
        </div>
      </div>

      <div
        className="animate-in fade-in slide-in-from-left-4 flex flex-col gap-2 duration-500"
        style={{ animationDelay: '200ms', animationFillMode: 'both' }}
      >
        <AppLabel htmlFor="message" theme={formTheme}>
          {t('form.message')}
        </AppLabel>
        <AppTextarea
          id="message"
          rows={3}
          theme={formTheme}
          placeholder={t(`form.modes.${type}.placeholderMessage`)}
          error={!!errors.message}
          {...register('message')}
        />
        {errors.message && <p className={errorStyles}>{errors.message.message}</p>}
      </div>

      <div
        className="animate-in fade-in slide-in-from-left-4 flex justify-end pt-5 duration-500"
        style={{ animationDelay: '250ms', animationFillMode: 'both' }}
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
