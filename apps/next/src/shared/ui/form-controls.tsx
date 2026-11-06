import { ComponentProps } from 'react';
import { Input, Label, Textarea } from '@pipeline/ui';
import { cn } from '@/shared/lib';

export const AppLabel = ({ className, ...props }: ComponentProps<typeof Label>) => (
  <Label
    className={cn('text-[10px] tracking-widest text-[#2dd4bf]/80 uppercase', className)}
    {...props}
  />
);

interface AppInputProps extends ComponentProps<typeof Input> {
  error?: boolean;
}

export const AppInput = ({ className, error, ...props }: AppInputProps) => (
  <Input
    className={cn(
      'h-12 w-full rounded-xl border bg-[#040a09] px-4 py-3 text-sm transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
      error
        ? 'border-red-500/50 text-red-400 placeholder:text-red-400/60 focus-visible:border-red-500 focus-visible:ring-red-500/50'
        : 'border-slate-800 text-[#d1faf5] placeholder-slate-600 focus-visible:border-[#2dd4bf]/50 focus-visible:ring-[#2dd4bf]/50',
      className,
    )}
    {...props}
  />
);

interface AppTextareaProps extends ComponentProps<typeof Textarea> {
  error?: boolean;
}

export const AppTextarea = ({ className, error, ...props }: AppTextareaProps) => (
  <Textarea
    className={cn(
      'min-h-[120px] w-full resize-none rounded-xl border bg-[#040a09] p-4 text-sm transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
      error
        ? 'border-red-500/50 text-red-400 placeholder:text-red-400/60 focus-visible:border-red-500 focus-visible:ring-red-500/50'
        : 'border-slate-800 text-[#d1faf5] placeholder-slate-600 focus-visible:border-[#2dd4bf]/50 focus-visible:ring-[#2dd4bf]/50',
      className,
    )}
    {...props}
  />
);
