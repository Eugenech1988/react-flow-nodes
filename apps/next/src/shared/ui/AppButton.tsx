'use client';

import { type ElementType, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@pipeline/ui';
import { cn } from '@/shared/lib';

export type ButtonVariant =
  'primary' | 'secondary' | 'danger' | 'regular' | 'ghost' | 'teal' | 'nav';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

export interface IAppButtonProps extends Omit<
  ComponentPropsWithoutRef<'button'>,
  'onChange' | 'onSelect'
> {
  text?: string;
  children?: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ElementType | null;
  iconClassName?: string;
  isPending?: boolean;
  pendingText?: string;
  isDisabled?: boolean;
  isLink?: boolean;
  linkTo?: string;
  external?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'relative overflow-hidden text-white border border-teal-900/40 bg-linear-to-r from-teal-500 to-teal-600 focus-visible:ring-teal-500/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.18),inset_0_-1px_0_rgba(0,0,0,0.25),0_2px_8px_rgba(0,0,0,0.35)] before:absolute before:inset-0 before:bg-linear-to-r before:from-teal-400 before:to-teal-500 before:opacity-0 hover:before:opacity-100 before:transition-opacity active:before:from-teal-600 active:before:to-teal-700 active:scale-[0.98]',
  teal: 'relative overflow-hidden bg-[#39b39b] hover:bg-[#329e88] text-slate-950 font-bold shadow-[inset_0_1px_0_rgba(255,255,255,0.35),inset_0_-1px_0_rgba(0,0,0,0.2),0_4px_14px_rgba(57,179,155,0.25)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.35),inset_0_-1px_0_rgba(0,0,0,0.2),0_0_22px_rgba(57,179,155,0.5)] cursor-pointer',
  nav: 'relative rounded-xl px-4 py-2 text-sm text-neutral-300 bg-transparent hover:bg-white/5 hover:text-white transition-colors cursor-pointer font-normal shadow-none after:absolute after:bottom-1 after:left-1/2 after:h-[1.5px] after:w-0 after:-translate-x-1/2 after:bg-teal-400/80 after:shadow-[0_0_8px_rgba(57,179,155,0.8)] after:transition-all hover:after:w-1/2',
  secondary:
    'relative text-zinc-600 hover:text-zinc-900 border border-zinc-200 bg-zinc-50/80 hover:bg-zinc-200/80 hover:border-zinc-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_1px_3px_rgba(0,0,0,0.05)] focus-visible:ring-zinc-400/30 active:bg-zinc-300 active:scale-[0.98] transition-all duration-150 dark:text-zinc-300 dark:hover:text-zinc-100 dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:bg-zinc-800 dark:hover:border-zinc-700 dark:focus-visible:ring-zinc-700/40 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_1px_3px_rgba(0,0,0,0.4)]',
  danger:
    'relative overflow-hidden text-white border border-rose-900/40 bg-linear-to-r from-rose-600 to-rose-500 focus-visible:ring-rose-500/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.18),inset_0_-1px_0_rgba(0,0,0,0.25),0_2px_8px_rgba(0,0,0,0.35)] before:absolute before:inset-0 before:bg-linear-to-r before:from-rose-500 before:to-rose-400 before:opacity-0 hover:before:opacity-100 before:transition-opacity active:before:from-rose-700 active:before:to-rose-600 active:scale-[0.98]',
  regular:
    'relative text-foreground border border-border bg-card shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_1px_2px_rgba(0,0,0,0.08)] focus-visible:ring-ring/50 transition-colors active:scale-[0.98]',
  ghost:
    'text-muted-foreground hover:text-foreground hover:bg-transparent border border-transparent bg-transparent shadow-none focus-visible:ring-zinc-400/30 transition-colors active:scale-[0.98] dark:focus-visible:ring-zinc-700/40',
};

const sizeStyles: Record<ButtonSize, { button: string; icon: string }> = {
  xs: {
    button: 'px-3 py-1 text-xs rounded-xl min-h-8',
    icon: 'w-3.5 h-3.5',
  },
  sm: {
    button: 'px-3.5 py-1.5 text-xs rounded-xl min-h-9',
    icon: 'w-4 h-4',
  },
  md: {
    button: 'px-4 py-2 text-sm rounded-xl min-h-10',
    icon: 'w-4 h-4',
  },
  lg: {
    button: 'px-8 py-4 text-sm rounded-xl min-h-12',
    icon: 'w-5 h-5',
  },
};

export const AppButton = ({
  text,
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconClassName,
  isPending = false,
  pendingText,
  isDisabled = false,
  type = 'button',
  onClick,
  className,
  isLink = false,
  linkTo = '#',
  external,
  ...props
}: IAppButtonProps) => {
  const disabled = isDisabled || isPending;
  const currentSize = variant === 'nav' ? { button: '', icon: 'w-4 h-4' } : sizeStyles[size];

  const sharedClasses = cn(
    'inline-flex cursor-pointer items-center justify-center gap-2 font-medium transition-all outline-none focus-visible:ring-2 disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed shrink-0 box-border',
    variantStyles[variant],
    variant !== 'nav' && currentSize.button,
    className,
  );

  const content = (
    <span className="relative z-10 inline-flex items-center justify-center gap-2">
      {isPending ? (
        <>
          <Loader2 className={cn(currentSize.icon, 'animate-spin', iconClassName)} />
          <span>{pendingText || text || children}</span>
        </>
      ) : (
        <>
          {Icon && <Icon className={cn(currentSize.icon, iconClassName)} />}
          {text || children}
        </>
      )}
    </span>
  );

  if (isLink && linkTo && !disabled) {
    const isExternal = external ?? (linkTo.startsWith('http://') || linkTo.startsWith('https://'));

    return (
      <Button
        {...({
          render: (buttonProps: any) => {
            const { ref: _ref, ...linkProps } = buttonProps;

            if (isExternal) {
              return (
                <a href={linkTo} target="_blank" rel="noopener noreferrer" {...linkProps}>
                  {content}
                </a>
              );
            }

            return (
              <a href={linkTo} {...linkProps}>
                {content}
              </a>
            );
          },
          className: sharedClasses,
          onClick: onClick,
          ...props,
        } as any)}
      />
    );
  }

  return (
    <Button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={sharedClasses}
      {...(props as any)}
    >
      {content}
    </Button>
  );
};
