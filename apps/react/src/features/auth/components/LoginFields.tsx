import type { FC } from 'react';
import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import { FloatingInput } from '@/shared/ui';
import type { CombinedFormData } from '../model/types';
import { DEFAULT_TEXT_CLASSES, DEFAULT_LABEL_CLASSES, DEFAULT_FIELDSET_CLASSES } from '@/features/auth/model';

interface LoginFieldsProps {
  register: UseFormRegister<CombinedFormData>;
  errors: FieldErrors<CombinedFormData>;
  inputClasses?: string;
  labelClasses?: string;
  fieldsetClasses?: string;
  error?: boolean;
}

export const LoginFields: FC<LoginFieldsProps> = ({
                                                    register,
                                                    errors,
                                                    error
                                                  }) => {
  return (
    <>
      <FloatingInput
        {...register('email')}
        type="text"
        autoComplete="email"
        label="Email Address"
        error={error || !!errors.email}
        errorMessage={errors.email?.message}
        labelClasses={DEFAULT_LABEL_CLASSES}
        fieldsetClasses={DEFAULT_FIELDSET_CLASSES}
        className={DEFAULT_TEXT_CLASSES}
      />

      <FloatingInput
        {...register('password')}
        type="password"
        autoComplete="current-password"
        label="Password"
        error={error || !!errors.password}
        errorMessage={errors.password?.message}
        labelClasses={DEFAULT_LABEL_CLASSES}
        fieldsetClasses={DEFAULT_FIELDSET_CLASSES}
        className={DEFAULT_TEXT_CLASSES}
      />
    </>
  );
};