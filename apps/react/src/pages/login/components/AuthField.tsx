import type { ComponentProps } from 'react';
import { Input, Label } from '@pipeline/ui';
import { cn } from '@/shared/lib';

interface AuthFieldProps extends ComponentProps<typeof Input> {
  label: string;
  error?: string;
}

export const AuthField = ({ label, error, className, id, ...props }: AuthFieldProps) => {
  return (
    <div className="space-y-1.5">
      <Label
        htmlFor={id}
        className="text-xs font-medium text-zinc-400 transition-colors duration-300"
      >
        {label}
      </Label>
      <Input
        id={id}
        className={cn(
          'h-11 w-full rounded-md border bg-white/5 px-3.5 py-2 text-sm text-white transition-all duration-300 focus-visible:ring-1 focus-visible:outline-none',
          '[&:-webkit-autofill]:shadow-[inset_0_0_0_100px_#050505]! [&:-webkit-autofill]:[-webkit-text-fill-color:white]! [&:-webkit-autofill]:outline-none!',
          error
            ? 'border-rose-500/50 focus-visible:border-rose-500 focus-visible:ring-rose-500/50'
            : 'border-white/10 focus-visible:border-teal-500 focus-visible:ring-teal-500/50',
          className,
        )}
        {...props}
      />
      {error && (
        <p className="animate-in fade-in slide-in-from-top-1 text-xs text-rose-400">
          {error}
        </p>
      )}
    </div>
  );
};