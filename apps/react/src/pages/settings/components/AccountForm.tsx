import { Link } from 'react-router-dom';
import { Save, ArrowLeft, ShieldCheck } from 'lucide-react';
import { type UseFormReturn, Controller } from 'react-hook-form';
import { FloatingInput } from '@/shared/ui/FloatingInput';
import { Button, Switch } from '@pipeline/ui';
import type { IAccountFormData } from '../types';

interface AccountFormProps {
  form: UseFormReturn<IAccountFormData>;
  onSubmit: (e: React.FormEvent) => void;
  isPristine: boolean;
}

export const AccountForm = ({ form, onSubmit, isPristine }: AccountFormProps) => {
  const { register, control, formState: { errors } } = form;

  return (
    <div className="border border-border bg-card rounded-xl shadow-xs overflow-hidden backdrop-blur-xs">
      <div className="px-6 py-4 border-b border-border/60 bg-muted/10">
        <h3 className="font-medium text-sm text-foreground/90">Security & Authentication</h3>
      </div>

      <form onSubmit={onSubmit} className="p-6 space-y-6">
        <div className="space-y-4">
          <FloatingInput
            label="Current Password"
            type="password"
            id="currentPassword"
            error={!!errors.currentPassword}
            errorMessage={errors.currentPassword?.message}
            {...register('currentPassword')}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FloatingInput
              label="New Password"
              type="password"
              id="newPassword"
              error={!!errors.newPassword}
              errorMessage={errors.newPassword?.message}
              {...register('newPassword')}
            />
            <FloatingInput
              label="Confirm New Password"
              type="password"
              id="confirmPassword"
              error={!!errors.confirmPassword}
              errorMessage={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />
          </div>
        </div>

        <div className="pt-4 border-t border-border/60">
          <div className="flex items-start justify-between rounded-lg border border-border p-4 bg-muted/5">
            <div className="space-y-0.5 pr-4">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                Two-Factor Authentication
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Secure your account with an additional security layer via authenticator app.
              </p>
            </div>
            <Controller
              control={control}
              name="twoFactorEnabled"
              render={({ field }) => (
                <Switch
                  id="twoFactorEnabled"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="data-[state=checked]:bg-emerald-500 data-[state=checked]:hover:bg-emerald-400"
                />
              )}
            />
          </div>
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
            disabled={isPristine}
            className="flex items-center gap-2 px-4 py-4.5 text-sm font-medium text-white bg-teal-600 hover:bg-teal-500 active:bg-teal-700 rounded-lg cursor-pointer shadow-xs transition-colors outline-none focus-visible:ring-2 focus-visible:ring-teal-500/20 disabled:opacity-50 disabled:pointer-events-none"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};