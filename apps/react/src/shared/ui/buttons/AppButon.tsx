import { type ElementType, type ComponentPropsWithoutRef } from 'react';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Button } from '@pipeline/ui';
import { cn } from '@/shared/lib';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'regular' | 'ghost';
export type ButtonSize = 'xs' | 'sm' | 'md';

interface AppButtonProps {
  text?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ElementType | null;
  iconClassName?: string;
  isPending?: boolean;
  pendingText?: string;
  isDisabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  isLink?: boolean;
  linkTo?: string;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'relative overflow-hidden text-white border border-transparent bg-linear-to-r from-teal-700 to-teal-600 focus-visible:ring-teal-500/20 shadow-xs before:absolute before:inset-0 before:bg-linear-to-r before:from-teal-600 before:to-teal-500 before:opacity-0 hover:before:opacity-100 before:transition-opacity active:before:from-teal-800 active:before:to-teal-700 active:scale-[0.98]',
  secondary:
    'text-zinc-600 hover:text-zinc-900 border border-zinc-200 bg-zinc-50/80 hover:bg-zinc-200/80 hover:border-zinc-300 hover:shadow-xs focus-visible:ring-zinc-400/30 active:bg-zinc-300 active:scale-[0.98] transition-all duration-150 dark:text-zinc-300 dark:hover:text-zinc-100 dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:bg-zinc-800 dark:hover:border-zinc-700 dark:focus-visible:ring-zinc-700/40',
  danger:
    'relative overflow-hidden text-white border border-transparent bg-linear-to-r from-rose-600 to-rose-500 focus-visible:ring-rose-500/20 shadow-xs before:absolute before:inset-0 before:bg-linear-to-r before:from-rose-500 before:to-rose-400 before:opacity-0 hover:before:opacity-100 before:transition-opacity active:before:from-rose-700 active:before:to-rose-600 active:scale-[0.98]',
  regular:
    'text-foreground border border-border bg-card focus-visible:ring-ring/50 shadow-xs transition-colors active:scale-[0.98]',
  ghost:
    'text-muted-foreground hover:text-foreground hover:bg-transparent border border-transparent bg-transparent shadow-none focus-visible:ring-zinc-400/30 transition-colors active:scale-[0.98] dark:focus-visible:ring-zinc-700/40',
};

const sizeStyles: Record<ButtonSize, { button: string; icon: string }> = {
  xs: {
    button: 'px-3 py-1 text-xs rounded-lg min-h-8',
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
};

export const AppButton = ({
                            text,
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
                          }: AppButtonProps) => {
  const disabled = isDisabled || isPending;
  const currentSize = sizeStyles[size];

  const sharedClasses = cn(
    'inline-flex items-center justify-center gap-2 font-medium cursor-pointer transition-all outline-none focus-visible:ring-2 disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed shrink-0 box-border',
    variantStyles[variant],
    currentSize.button,
    className
  );

  const content = (
    <span className="relative z-10 inline-flex items-center justify-center gap-2">
      {isPending ? (
        <>
          <Loader2 className={cn(currentSize.icon, 'animate-spin', iconClassName)} />
          <span>{pendingText || text}</span>
        </>
      ) : (
        <>
          {Icon && <Icon className={cn(currentSize.icon, iconClassName)} />}
          {text && <span>{text}</span>}
        </>
      )}
    </span>
  );

  if (isLink && linkTo && !disabled) {
    const isExternal = linkTo.startsWith('http://') || linkTo.startsWith('https://');

    return (
      <Button
        render={(buttonProps) => {
          const { ref: _ref, ...linkProps } = buttonProps as { ref?: unknown } & ComponentPropsWithoutRef<'a'>;

          if (isExternal) {
            return (
              <a
                href={linkTo}
                target="_blank"
                rel="noopener noreferrer"
                {...linkProps}
              />
            );
          }

          return <Link to={linkTo} {...linkProps} />;
        }}
        className={sharedClasses}
        onClick={onClick}
      >
        {content}
      </Button>
    );
  }

  return (
    <Button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={sharedClasses}
    >
      {content}
    </Button>
  );
};