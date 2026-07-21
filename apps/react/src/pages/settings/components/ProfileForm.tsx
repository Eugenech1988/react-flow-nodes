import { Link } from 'react-router-dom';
import { Save, ArrowLeft, Loader2 } from 'lucide-react';
import { type UseFormReturn } from 'react-hook-form';
import { FloatingInput, LocalAlert } from '@/shared/ui';
import { Button } from '@pipeline/ui';
import type { IProfileFormData } from '../types';

interface ProfileFormProps {
  form: UseFormReturn<IProfileFormData>;
  onSubmit: (e: React.FormEvent) => void;
  isPristine: boolean;
  isPending?: boolean;
  alert?: { type: 'success' | 'error'; message: string } | null;
}

export const ProfileForm = ({ form, onSubmit, isPristine, isPending = false, alert = null }: ProfileFormProps) => {
  const { register, formState: { errors } } = form;

  const rootError = errors.root?.message || errors['' as keyof typeof errors]?.message;

  const hasError = alert?.type === 'error' || !!rootError;
  const hasSuccess = alert?.type === 'success';
  const alertMessage = alert?.message || (rootError as string);

  return (
    <div className="border border-border bg-card rounded-xl shadow-xs overflow-hidden backdrop-blur-xs">
      <div className="px-6 py-4 border-b border-border/60 bg-muted/10">
        <h3 className="font-medium text-sm text-foreground/90">Personal Information</h3>
      </div>

      <form onSubmit={onSubmit} className="p-6 space-y-4">
        <LocalAlert
          hasSuccess={hasSuccess}
          hasError={hasError}
          alertMessage={alertMessage}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FloatingInput
            {...register('firstName')}
            label="First Name"
            id="firstName"
            error={!!errors.firstName}
            errorMessage={errors.firstName?.message}
          />
          <FloatingInput
            {...register('lastName')}
            label="Last Name"
            id="lastName"
            error={!!errors.lastName}
            errorMessage={errors.lastName?.message}
          />
        </div>

        <FloatingInput
          {...register('email')}
          label="Email Address"
          type="email"
          id="email"
          disabled
          error={!!errors.email}
          errorMessage={errors.email?.message}
          className="opacity-60"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FloatingInput
            {...register('company')}
            label="Company"
            id="company"
            error={!!errors.company}
            errorMessage={errors.company?.message}
          />
          <FloatingInput
            {...register('location')}
            label="Location"
            id="location"
            error={!!errors.location}
            errorMessage={errors.location?.message}
          />
        </div>

        <div className="flex justify-end items-center gap-2 pt-4 border-t border-border/60">
          <Link
            to="/"
            className="group flex items-center gap-2 px-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring/50 rounded-md"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to app
          </Link>

          <Button
            type="submit"
            disabled={isPristine || isPending}
            className="flex items-center gap-2 px-4 py-4.5 text-sm font-medium text-white bg-teal-600 hover:bg-teal-500 active:bg-teal-700 rounded-lg cursor-pointer shadow-xs transition-colors outline-none focus-visible:ring-2 focus-visible:ring-teal-500/20 disabled:opacity-50 disabled:pointer-events-none"
          >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};