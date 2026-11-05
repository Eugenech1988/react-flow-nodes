import { type ElementType, type ComponentPropsWithoutRef } from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { Button } from '@pipeline/ui';
import { cn } from '@/lib/utils';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'regular' | 'ghost';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

export interface IAppButtonProps {
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
  primary: '',
  secondary: '',
  danger: '',
  regular: '',
  ghost: '',
};

const sizeStyles: Record<ButtonSize, { button: string; icon: string }> = {
  xs: {
    button: '',
    icon: '',
  },
  sm: {
    button: '',
    icon: '',
  },
  md: {
    button: '',
    icon: '',
  },
  lg: {
    button: '',
    icon: '',
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
}: IAppButtonProps) => {
  const disabled = isDisabled || isPending;
  const currentSize = sizeStyles[size];

  const sharedClasses = cn(variantStyles[variant], currentSize.button, className);

  const content = (
    <span className="inline-flex items-center justify-center gap-2">
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
          const { ref: _ref, ...linkProps } = buttonProps as {
            ref?: unknown;
          } & ComponentPropsWithoutRef<'a'>;

          if (isExternal) {
            return <a href={linkTo} target="_blank" rel="noopener noreferrer" {...linkProps} />;
          }

          return <Link href={linkTo} {...linkProps} />;
        }}
        className={sharedClasses}
      >
        {content}
      </Button>
    );
  }

  return (
    <Button type={type} disabled={disabled} onClick={onClick} className={sharedClasses}>
      {content}
    </Button>
  );
};
