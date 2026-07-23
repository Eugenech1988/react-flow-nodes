import type { FC } from 'react';
import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import { FloatingInput } from '@/shared/ui';
import type { CombinedFormData } from '../model/types';
import { DEFAULT_FIELDSET_CLASSES, DEFAULT_LABEL_CLASSES, DEFAULT_TEXT_CLASSES } from '@/features/auth/model';

interface RegisterFieldsProps {
  register: UseFormRegister<CombinedFormData>;
  errors: FieldErrors<CombinedFormData>;
  inputClasses?: string;
}

export const RegisterFields: FC<RegisterFieldsProps> = ({ register, errors }) => {
  return (
    <>
      <FloatingInput
        {...register('email')}
        type="email"
        autoComplete="email"
        label="Email Address"
        error={!!errors.email}
        errorMessage={errors.email?.message}
        labelClasses={DEFAULT_LABEL_CLASSES}
        fieldsetClasses={DEFAULT_FIELDSET_CLASSES}
        className={DEFAULT_TEXT_CLASSES}
      />

      <FloatingInput
        {...register('password')}
        type="password"
        autoComplete="new-password"
        label="Password"
        error={!!errors.password}
        errorMessage={errors.password?.message}
        labelClasses={DEFAULT_LABEL_CLASSES}
        fieldsetClasses={DEFAULT_FIELDSET_CLASSES}
        className={DEFAULT_TEXT_CLASSES}
      />

      <FloatingInput
        {...register('confirmPassword')}
        type="password"
        autoComplete="new-password"
        label="Confirm Password"
        error={!!errors.confirmPassword}
        errorMessage={errors.confirmPassword?.message}
        labelClasses={DEFAULT_LABEL_CLASSES}
        fieldsetClasses={DEFAULT_FIELDSET_CLASSES}
        className={DEFAULT_TEXT_CLASSES}
      />
    </>
  );
};