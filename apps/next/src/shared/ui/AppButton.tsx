'use client';

import type { ElementType, ComponentPropsWithoutRef, ComponentProps, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@pipeline/ui/button';
import { cn } from '@/shared/lib';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'danger'
  | 'regular'
  | 'ghost'
  | 'teal'
  | 'nav'
  | 'careers'
  | 'careers-outline';

export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

export interface IAppButtonProps extends Omit<
  ComponentPropsWithoutRef<'button'>,
  | 'onChange'
  | 'onSelect'
  | 'onChangeCapture'
  | 'onInput'
  | 'onInputCapture'
  | 'onBeforeInputCapture'
  | 'onReset'
  | 'onSubmit'
  | 'onInvalid'
  | 'onInvalidCapture'
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
  newTab?: boolean;
  ariaLabel?: string;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'relative overflow-hidden text-white border border-teal-900/40 bg-linear-to-r from-teal-500 to-teal-600 focus-visible:ring-teal-500/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.18),inset_0_-1px_0_rgba(0,0,0,0.25),0_2px_8px_rgba(0,0,0,0.35)] before:absolute before:inset-0 before:bg-linear-to-r before:from-teal-400 before:to-teal-500 before:opacity-0 hover:before:opacity-100 before:transition-opacity active:before:from-teal-600 active:before:to-teal-700 active:scale-[0.98] hover:shadow-[0_0_20px_rgba(57,179,155,0.4)]',
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
  careers:
    'group relative overflow-hidden !rounded-sm border border-[#4a6d5e] bg-[#0d1f1e] font-typewriter text-xs uppercase tracking-widest text-[#9cc4b0] shadow-[inset_0_2px_4px_rgba(0,0,0,0.6),0_2px_0_#2f3d36] transition-all duration-150 ease-out hover:border-[#6fa28c] hover:bg-[#141a16] hover:text-[#e8f4ee] hover:shadow-[inset_0_0_10px_rgba(111,162,140,0.3),0_0_8px_rgba(111,162,140,0.2)] active:translate-y-[2px] active:shadow-none',
  'careers-outline':
    'relative overflow-hidden !rounded-sm border border-[#2f3d36] bg-[#0a0e0d] font-typewriter text-xs uppercase tracking-widest text-[#8a9488] shadow-[inset_0_2px_4px_rgba(0,0,0,0.6),0_2px_0_#1a2420] transition-all duration-150 ease-out hover:border-[#4a6d5e] hover:bg-[#141a16] hover:text-[#9cc4b0] active:translate-y-[2px] active:shadow-none',
};

const sizeStyles: Record<ButtonSize, { button: string; icon: string }> = {
  xs: { button: 'px-3 py-1 text-xs rounded-xl min-h-8', icon: 'w-3.5 h-3.5' },
  sm: { button: 'px-3.5 py-1.5 text-xs rounded-xl min-h-9', icon: 'w-4 h-4' },
  md: { button: 'px-4 py-2 text-sm rounded-xl min-h-10', icon: 'w-4 h-4' },
  lg: { button: 'px-8 py-4 text-sm rounded-xl min-h-12', icon: 'w-5 h-5' },
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
  newTab,
  ariaLabel,
  'aria-label': nativeAriaLabel,
  ...props
}: IAppButtonProps) => {
  const disabled = isDisabled || isPending;
  const currentSize = variant === 'nav' ? { button: '', icon: 'w-4 h-4' } : sizeStyles[size];
  const effectiveAriaLabel = ariaLabel || nativeAriaLabel;

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
          <Loader2
            aria-hidden="true"
            className={cn(currentSize.icon, 'animate-spin', iconClassName)}
          />
          <span>{pendingText || text || children}</span>
        </>
      ) : (
        <>
          {Icon && (
            <Icon
              aria-hidden="true"
              focusable="false"
              className={cn(currentSize.icon, iconClassName)}
            />
          )}
          {text || children}
        </>
      )}
    </span>
  );

  const safeProps = { ...props } as Record<string, unknown>;
  delete safeProps.onClick;
  delete safeProps.className;

  if (isLink && linkTo && !disabled) {
    const finalTarget = newTab ? '_blank' : undefined;

    return (
      <Button
        aria-label={effectiveAriaLabel}
        render={(buttonProps) => {
          const { ref: ignoredRef, ...linkProps } = buttonProps as Record<string, unknown>;
          void ignoredRef;
          return (
            <a
              {...(linkProps as ComponentProps<'a'>)}
              href={linkTo}
              target={finalTarget}
              rel={newTab ? 'noopener noreferrer' : undefined}
            >
              {content}
            </a>
          );
        }}
        className={sharedClasses}
        onClick={onClick}
        {...safeProps}
      />
    );
  }

  return (
    <Button
      type={type}
      disabled={disabled}
      aria-label={effectiveAriaLabel}
      className={sharedClasses}
      onClick={onClick}
      {...safeProps}
    >
      {content}
    </Button>
  );
};
