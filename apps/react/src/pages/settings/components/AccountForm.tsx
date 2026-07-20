import { Link } from 'react-router-dom';
import { Save, ArrowLeft, Loader2 } from 'lucide-react';
import { type UseFormReturn } from 'react-hook-form';
import { FloatingInput } from '@/shared/ui/FloatingInput';
import { Button } from '@pipeline/ui';
import { LocalAlert } from '@/shared/ui';
import type { IAccountFormData } from '../types';

interface AccountFormProps {
  form: UseFormReturn<IAccountFormData>;
  onSubmit: (e: React.FormEvent) => void;
  isPristine: boolean;
  isPending?: boolean;
  alert?: { type: 'success' | 'error'; message: string } | null;
}

//TODO check validations

export const AccountForm = ({
                              form,
                              onSubmit,
                              isPristine,
                              isPending = false,
                              alert = null
                            }: AccountFormProps) => {
  const { register, formState: { errors } } = form;

  const rootError = errors.root?.message || errors['' as keyof typeof errors]?.message;

  const hasError = alert?.type === 'error' || !!rootError;
  const hasSuccess = alert?.type === 'success';
  const alertMessage = alert?.message || (rootError as string);

  return (
    <div className="border border-border bg-card rounded-xl shadow-xs overflow-hidden backdrop-blur-xs">
      <div className="px-6 py-4 border-b border-border/60 bg-muted/10">
        <h3 className="font-medium text-sm text-foreground/90">Security & Authentication</h3>
      </div>

      <form onSubmit={onSubmit} className="p-6 space-y-6">
        <LocalAlert
          hasSuccess={hasSuccess}
          hasError={hasError}
          alertMessage={alertMessage}
        />

        <div className="space-y-4">
          <FloatingInput
            id="currentPassword"
            label="Current Password"
            type="password"
            {...register('currentPassword')}
            error={!!errors.currentPassword}
            errorMessage={errors.currentPassword?.message}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FloatingInput
              id="newPassword"
              label="New Password"
              type="password"
              {...register('newPassword')}
              error={!!errors.newPassword}
              errorMessage={errors.newPassword?.message}
            />
            <FloatingInput
              id="confirmPassword"
              label="Confirm New Password"
              type="password"
              {...register('confirmPassword')}
              error={!!errors.confirmPassword}
              errorMessage={errors.confirmPassword?.message}
            />
          </div>
        </div>

        <div className="flex justify-end items-center gap-2 pt-4 border-t border-border/60">
          <Link
            to="/"
            className="group flex items-center gap-2 px-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring/50 rounded-md"
          >
            <ArrowLeft className="w-4 h-4"/>
            Back to app
          </Link>

          <Button
            type="submit"
            disabled={isPristine || isPending} // Кнопка теперь заблокирована, если форма «чистая»
            className="flex items-center gap-2 px-4 py-4.5 text-sm font-medium text-white bg-teal-600 hover:bg-teal-500 active:bg-teal-700 rounded-lg cursor-pointer shadow-xs transition-colors outline-none focus-visible:ring-2 focus-visible:ring-teal-500/20 disabled:opacity-50 disabled:pointer-events-none"
          >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4"/>}
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};