import { ComponentProps } from 'react';
import { Input } from '@pipeline/ui/input';
import { Textarea } from '@pipeline/ui/textarea';
import { Label } from '@pipeline/ui/label';
import { cn } from '@/shared/lib';
import type { TUiTheme } from './theme';

interface IAppLabelProps extends ComponentProps<typeof Label> {
  theme?: TUiTheme;
}

export const AppLabel = ({ className, theme = 'default', ...props }: IAppLabelProps) => (
  <Label
    className={cn(
      'text-[10px] tracking-widest uppercase',
      'text-theme-accent/80',
      theme === 'careers' && 'font-typewriter',
      theme === 'blog' && 'font-mono',
      className,
    )}
    {...props}
  />
);

interface IAppInputProps extends ComponentProps<typeof Input> {
  error?: boolean;
  theme?: TUiTheme;
}

export const AppInput = ({ className, error, theme = 'default', ...props }: IAppInputProps) => (
  <Input
    className={cn(
      'w-full transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
      'border-theme-line bg-theme-bg text-theme-fg',

      theme === 'default' && 'h-12 rounded-xl px-4 py-3 text-sm',
      theme === 'careers' &&
      'font-typewriter h-10 rounded-sm px-3 py-2 text-sm shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]',
      theme === 'blog' && 'h-10 rounded-sm px-3 py-2 font-mono text-sm',

      error
        ? 'border-theme-danger text-theme-danger placeholder:text-theme-danger/60 focus-visible:ring-theme-danger/50'
        : 'placeholder:text-theme-dim focus-visible:border-theme-accent focus-visible:ring-theme-accent/50',
      className,
    )}
    {...props}
  />
);

interface IAppTextareaProps extends ComponentProps<typeof Textarea> {
  error?: boolean;
  theme?: TUiTheme;
}

export const AppTextarea = ({
                              className,
                              error,
                              theme = 'default',
                              ...props
                            }: IAppTextareaProps) => (
  <Textarea
    className={cn(
      'min-h-30 w-full resize-none transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
      'border-theme-line bg-theme-bg text-theme-fg',

      theme === 'default' && 'rounded-xl p-4 text-sm',
      theme === 'careers' &&
      'font-typewriter rounded-sm p-3 text-sm shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]',
      theme === 'blog' && 'rounded-sm p-3 font-mono text-sm',

      error
        ? 'border-theme-danger text-theme-danger placeholder:text-theme-danger/60 focus-visible:ring-theme-danger/50'
        : 'placeholder:text-theme-dim focus-visible:border-theme-accent focus-visible:ring-theme-accent/50',
      className,
    )}
    {...props}
  />
);