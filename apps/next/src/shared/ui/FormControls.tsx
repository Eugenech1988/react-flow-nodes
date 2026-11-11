import { ComponentProps } from 'react';
import { Input } from '@pipeline/ui/input';
import { Textarea } from '@pipeline/ui/textarea';
import { Label } from '@pipeline/ui/label';
import { cn } from '@/shared/lib';

type TFormTheme = 'default' | 'careers' | 'blog';

interface IAppLabelProps extends ComponentProps<typeof Label> {
  theme?: TFormTheme;
}

export const AppLabel = ({ className, theme = 'default', ...props }: IAppLabelProps) => (
  <Label
    className={cn(
      'text-[10px] tracking-widest uppercase',
      theme === 'default' && 'text-[#2dd4bf]/80',
      theme === 'careers' && 'text-[#6fa28c]/80',
      theme === 'blog' && 'text-[#2dd4bf]/80',
      className,
    )}
    {...props}
  />
);

interface IAppInputProps extends ComponentProps<typeof Input> {
  error?: boolean;
  theme?: TFormTheme;
}

export const AppInput = ({ className, error, theme = 'default', ...props }: IAppInputProps) => (
  <Input
    className={cn(
      'w-full transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
      theme === 'default' && 'h-12 rounded-xl border bg-[#040a09] px-4 py-3 text-sm',
      theme === 'careers' && 'h-10 rounded-sm border bg-[#0a0e0d]/50 px-3 py-2 font-typewriter text-sm',
      theme === 'blog' && 'h-10 rounded-sm border bg-[#0B1424] px-3 py-2 font-mono text-sm',
      error
        ? 'border-red-500/50 text-red-400 focus-visible:ring-red-500/50'
        : theme === 'careers'
          ? 'border-[#2f3d36] text-[#d4cfc0] focus-visible:ring-[#6fa28c]/50'
          : theme === 'blog'
            ? 'border-[#1E293B] text-[#e2e8f0] focus-visible:ring-[#2dd4bf]/50'
            : 'border-slate-800 text-[#d1faf5] focus-visible:ring-[#2dd4bf]/50',
      className,
    )}
    {...props}
  />
);

interface IAppTextareaProps extends ComponentProps<typeof Textarea> {
  error?: boolean;
  theme?: TFormTheme;
}

export const AppTextarea = ({ className, error, theme = 'default', ...props }: IAppTextareaProps) => (
  <Textarea
    className={cn(
      'min-h-30 w-full resize-none transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
      theme === 'default' && 'rounded-xl border bg-[#040a09] p-4 text-sm',
      theme === 'careers' && 'rounded-sm border bg-[#0a0e0d]/50 p-3 font-typewriter text-sm',
      theme === 'blog' && 'rounded-sm border bg-[#0B1424] p-3 font-mono text-sm',
      error
        ? 'border-red-500/50 text-red-400 focus-visible:ring-red-500/50'
        : theme === 'careers'
          ? 'border-[#2f3d36] text-[#d4cfc0] focus-visible:ring-[#6fa28c]/50'
          : theme === 'blog'
            ? 'border-[#1E293B] text-[#e2e8f0] focus-visible:ring-[#2dd4bf]/50'
            : 'border-slate-800 text-[#d1faf5] focus-visible:ring-[#2dd4bf]/50',
      className,
    )}
    {...props}
  />
);