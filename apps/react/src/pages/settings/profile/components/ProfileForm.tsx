import { ArrowLeft, Save } from 'lucide-react';
import { FloatingInput, LocalAlert, AppButton } from '@/shared/ui';
import { useUser } from '@/shared/hooks';
import { useProfileForm } from '../hooks';

export const ProfileForm = () => {
  const { user } = useUser();
  const { form, onSubmit, isPristine, isPending, alert } = useProfileForm();

  const {
    register,
    formState: { errors },
  } = form;

  const rootError = errors.root?.message;
  const hasError = alert?.type === 'error' || !!rootError;
  const hasSuccess = alert?.type === 'success';
  const alertMessage = alert?.message || rootError || '';

  return (
    <div className="border-border bg-card overflow-hidden rounded-xl border shadow-xs backdrop-blur-xs">
      <div className="border-border/60 bg-muted/10 border-b px-6 py-4">
        <h3 className="text-foreground/90 text-sm font-medium">Personal Information</h3>
      </div>

      <form onSubmit={onSubmit} className="space-y-4 p-6">
        <LocalAlert hasSuccess={hasSuccess} hasError={hasError} alertMessage={alertMessage} />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
          label="Email Address"
          type="email"
          id="email"
          disabled
          value={user?.email || ''}
          className="opacity-60"
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

        <FloatingInput
          {...register('jobTitle')}
          label="Job Title"
          id="jobTitle"
          error={!!errors.jobTitle}
          errorMessage={errors.jobTitle?.message}
        />

        <div className="border-border/60 flex items-center justify-end gap-2 border-t pt-4">
          <AppButton variant="ghost" isLink linkTo="/" icon={ArrowLeft} text="Back to app" />

          <AppButton
            type="submit"
            variant="primary"
            isPending={isPending}
            isDisabled={isPristine}
            text="Save Changes"
            pendingText="Saving..."
            icon={Save}
          />
        </div>
      </form>
    </div>
  );
};
