import { Link } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import { type UseFormReturn } from 'react-hook-form';
import { FloatingInput } from '@/shared/ui/FloatingInput';
import { Button } from '@pipeline/ui';
import type { IProfileFormData } from '../types';

interface ProfileFormProps {
  form: UseFormReturn<IProfileFormData>;
  onSubmit: (e: React.FormEvent) => void;
  isPristine: boolean;
}

export const ProfileForm = ({ form, onSubmit, isPristine }: ProfileFormProps) => {
  const { register, formState: { errors } } = form;

  return (
    <div className="md:col-span-2 border border-border bg-card rounded-xl shadow-xs overflow-hidden backdrop-blur-xs">
      <div className="px-6 py-4 border-b border-border/60 bg-muted/10">
        <h3 className="font-medium text-sm text-foreground/90">Personal Information</h3>
      </div>

      <form onSubmit={onSubmit} className="p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FloatingInput
            label="First Name"
            id="firstName"
            error={!!errors.firstName}
            errorMessage={errors.firstName?.message}
            {...register('firstName')}
          />
          <FloatingInput
            label="Last Name"
            id="lastName"
            error={!!errors.lastName}
            errorMessage={errors.lastName?.message}
            {...register('lastName')}
          />
        </div>

        <FloatingInput
          label="Email Address"
          type="email"
          id="email"
          disabled
          error={!!errors.email}
          errorMessage={errors.email?.message}
          {...register('email')}
          className="opacity-60"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FloatingInput
            label="Company"
            id="company"
            error={!!errors.company}
            errorMessage={errors.company?.message}
            {...register('company')}
          />
          <FloatingInput
            label="Location"
            id="location"
            error={!!errors.location}
            errorMessage={errors.location?.message}
            {...register('location')}
          />
        </div>

        <FloatingInput
          label="Job Title"
          id="jobTitle"
          error={!!errors.jobTitle}
          errorMessage={errors.jobTitle?.message}
          {...register('jobTitle')}
        />

        <div className="flex justify-end items-center gap-2 pt-4 border-t border-border/60">
          <Link
            to="/"
            className="group flex items-center gap-2 px-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer outline-hidden"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to app
          </Link>

          <Button
            type="submit"
            disabled={isPristine}
            className="flex items-center gap-2 px-4 py-4.5 text-sm font-medium text-white bg-teal-600 hover:bg-teal-500 active:bg-teal-700 rounded-lg cursor-pointer shadow-xs transition-colors outline-hidden focus:ring-teal-500/20"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};