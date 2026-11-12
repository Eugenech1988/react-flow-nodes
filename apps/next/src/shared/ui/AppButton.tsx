'use client';

import type { ElementType, ComponentPropsWithoutRef, ComponentProps, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@pipeline/ui/button';
import { cn } from '@/shared/lib';
import { themeScope, type TUiTheme } from './theme';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'danger'
  | 'regular'
  | 'ghost'
  | 'teal'
  | 'nav'
  | 'careers'
  | 'careers-outline'
  | 'blog'
  | 'blog-outline';

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
  ariaExpanded?: boolean;
}

const BUTTON_THEME: Partial<Record<ButtonVariant, TUiTheme>> = {
  careers: 'careers',
  'careers-outline': 'careers',
  blog: 'blog',
  'blog-outline': 'blog',
};

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'relative text-white bg-theme-accent-deep hover:bg-theme-accent transition-colors duration-200 active:scale-[0.98]',

  nav: 'relative px-5 py-3.5 text-sm text-theme-muted bg-transparent hover:bg-theme-panel hover:text-theme-fg transition-colors cursor-pointer font-normal shadow-none after:absolute after:bottom-0.75 after:left-1/2 after:h-[1.5px] after:w-0 after:-translate-x-1/2 after:bg-theme-accent after:shadow-[0_0_8px_var(--theme-accent)] after:transition-all hover:after:w-1/2',

  ghost:
    'text-theme-muted hover:text-theme-fg hover:bg-theme-panel border border-transparent bg-transparent shadow-none transition-colors active:scale-[0.98]',

  careers:
    'group relative overflow-hidden border border-theme-accent bg-theme-accent/20 font-typewriter text-xs uppercase tracking-widest text-theme-accent font-bold transition-all duration-150 ease-out hover:bg-theme-accent/30 hover:text-theme-accent-hover active:scale-[0.98] cursor-pointer',

  'careers-outline':
    'relative overflow-hidden border border-theme-line bg-transparent font-typewriter text-xs uppercase tracking-widest text-theme-muted transition-all duration-150 ease-out hover:border-theme-accent hover:bg-theme-panel hover:text-theme-fg active:scale-[0.98] cursor-pointer',

  blog: 'group relative overflow-hidden border border-theme-accent/40 bg-theme-accent/10 font-medium text-theme-accent shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] transition-all duration-150 ease-out hover:border-theme-accent hover:bg-theme-accent/20 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] active:translate-y-px cursor-pointer',

  'blog-outline':
    'relative overflow-hidden border border-theme-line bg-transparent font-medium text-theme-muted transition-all duration-150 ease-out hover:border-theme-accent hover:text-theme-accent active:translate-y-px cursor-pointer',

  secondary:
    'relative text-theme-fg border border-theme-line bg-theme-surface/80 hover:bg-theme-panel transition-all duration-150 active:scale-[0.98]',

  teal: 'relative bg-theme-accent text-white font-bold transition-all duration-200 hover:bg-theme-accent-hover hover:scale-[1.02] active:scale-[0.98] cursor-pointer',

  danger:
    'relative font-typewriter text-theme-fg bg-rose-600 hover:bg-rose-500 transition-colors duration-200 active:scale-[0.98]',

  regular:
    'relative font-typewriter text-theme-fg border border-theme-line bg-theme-surface hover:bg-theme-panel transition-colors active:scale-[0.98]',
};

const sizeStyles: Record<ButtonSize, { button: string; icon: string }> = {
  xs: { button: 'px-3 py-1 text-xs min-h-8', icon: 'w-3.5 h-3.5' },
  sm: { button: 'px-3.5 py-1.5 text-xs min-h-9', icon: 'w-4 h-4' },
  md: { button: 'px-4 py-2 text-sm min-h-10', icon: 'w-4 h-4' },
  lg: { button: 'px-8 py-4 text-sm min-h-12', icon: 'w-5 h-5' },
};

const BLOG_VARIANTS: ButtonVariant[] = ['blog', 'blog-outline'];
const SHARP_VARIANTS: ButtonVariant[] = ['careers', 'careers-outline', 'blog', 'blog-outline'];

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
  ariaExpanded,
  'aria-label': nativeAriaLabel,
  ...props
}: IAppButtonProps) => {
  const disabled = isDisabled || isPending;
  const isBlog = BLOG_VARIANTS.includes(variant);
  const isSharp = SHARP_VARIANTS.includes(variant);
  const scope = themeScope(BUTTON_THEME[variant]);

  const currentSize =
    variant === 'nav'
      ? { button: '', icon: 'w-4 h-4' }
      : isBlog
        ? {
            button:
              size === 'sm'
                ? 'h-8 px-3 text-xs'
                : size === 'lg'
                  ? 'h-11 px-6 text-sm'
                  : 'h-9 px-4 text-sm',
            icon: size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5',
          }
        : sizeStyles[size];

  const effectiveAriaLabel = ariaLabel || nativeAriaLabel;

  const sharedClasses = cn(
    'inline-flex cursor-pointer items-center justify-center gap-2 font-medium outline-none focus-visible:ring-2 disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed shrink-0 box-border',
    variant !== 'nav' && currentSize.button,
    isSharp ? 'rounded-sm' : 'rounded-xl',
    variantStyles[variant],
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
        {...scope}
        aria-label={effectiveAriaLabel}
        aria-expanded={ariaExpanded}
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
      {...scope}
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
