import React from 'react';
import { Input } from '@pipeline/ui';
import { cn } from '@/shared/lib';

export type RoundedSize = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';

const roundedMap: Record<RoundedSize, string> = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  full: 'rounded-full',
};

interface FloatingInputProps extends React.ComponentProps<typeof Input> {
  label: string;
  icon?: React.ReactNode;
  error?: boolean;
  errorMessage?: string;
  labelClasses?: string;
  fieldsetClasses?: string;
  className?: string;
  rounded?: RoundedSize;
}

export const FloatingInput = React.forwardRef<HTMLInputElement, FloatingInputProps>(
  (
    {
      label,
      icon,
      error,
      errorMessage,
      className = '',
      labelClasses = '',
      fieldsetClasses = '',
      rounded = 'xl',
      ...props
    },
    ref
  ) => {
    const hasIcon = Boolean(icon);
    const roundedClass = roundedMap[rounded] || roundedMap.xl;

    return (
      <div className="w-full">
        <div className={cn('relative w-full h-11 group flex items-center', roundedClass)}>
          {hasIcon && (
            <div
              className={cn(
                'absolute left-3.5 top-1/2 -translate-y-1/2 z-20 pointer-events-none transition-colors duration-200',
                'text-zinc-400 dark:text-zinc-500 group-hover:text-teal-500 dark:group-hover:text-teal-500 peer-focus:text-teal-500 peer-not-placeholder-shown:text-teal-500',
                error && 'text-red-500!'
              )}
            >
              {icon}
            </div>
          )}

          <Input
            {...props}
            ref={ref}
            placeholder=" "
            className={cn(
              'peer w-full h-full border-0 bg-transparent focus-visible:ring-0 py-0 placeholder:opacity-0 transition-all z-10 relative',
              roundedClass,
              hasIcon ? 'pl-10 pr-3' : 'px-3',
              'disabled:cursor-not-allowed disabled:text-muted-foreground/60',
              error
                ? 'text-red-500! [-webkit-text-fill-color:var(--color-red-500)]! autofill:[-webkit-text-fill-color:var(--color-red-500)]!'
                : 'text-foreground autofill:[-webkit-text-fill-color:var(--foreground)]!',
              className
            )}
          />

          <label
            className={cn(
              'absolute top-1/2 -translate-y-1/2 pointer-events-none text-sm font-sans transition-all duration-200 ease-in-out z-20 block select-none max-w-[calc(100%-24px)] truncate text-ellipsis origin-left',
              hasIcon ? 'left-10' : 'left-3.5',
              'text-zinc-400 dark:text-zinc-500',
              'group-hover:text-teal-500 dark:group-hover:text-teal-500',
              'peer-focus:text-teal-500 peer-focus-visible:text-teal-500 peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-[10px]',
              'peer-not-placeholder-shown:text-teal-500 peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:-translate-y-1/2 peer-not-placeholder-shown:text-[10px]',
              error
                ? 'text-red-500!'
                : 'group-hover:text-teal-500 dark:group-hover:text-teal-500 peer-focus:text-teal-500 peer-focus-visible:text-teal-500 peer-not-placeholder-shown:text-teal-500 dark:peer-focus:text-teal-500 dark:peer-focus-visible:text-teal-500 dark:peer-not-placeholder-shown:text-teal-500',
              labelClasses
            )}
          >
            {label}
          </label>

          <fieldset
            className={cn(
              'pointer-events-none absolute inset-0 -top-1.5 m-0 min-w-0 border transition-all duration-200 z-0 box-border',
              roundedClass,
              '[&_legend]:max-w-0 [&_legend]:transition-all [&_legend]:duration-200 [&_legend]:p-0 [&_legend]:invisible',
              'peer-focus:[&_legend]:max-w-full peer-focus:[&_legend]:px-1 peer-focus:[&_legend]:visible',
              'peer-not-placeholder-shown:[&_legend]:max-w-full peer-not-placeholder-shown:[&_legend]:px-1 peer-not-placeholder-shown:[&_legend]:visible',
              'autofill:[&_legend]:max-w-full autofill:[&_legend]:px-1 autofill:[&_legend]:visible',
              'peer-disabled:bg-muted/30 peer-disabled:border-border/40 peer-disabled:opacity-80',
              error
                ? 'border-red-500! shadow-[0_0_15px_rgba(239,68,68,0.02)]'
                : 'border-zinc-400 dark:border-zinc-500 hover:border-teal-500 dark:hover:border-teal-500 group-hover:border-teal-500 dark:group-hover:border-teal-500 peer-focus:border-teal-500 peer-focus-visible:border-teal-500 peer-not-placeholder-shown:border-teal-500 dark:peer-focus:border-teal-500 dark:peer-focus-visible:border-teal-500 dark:peer-not-placeholder-shown:border-teal-500',
              fieldsetClasses
            )}
          >
            <legend
              className={cn(
                'h-3 text-[10px] font-sans pointer-events-none block w-auto whitespace-nowrap box-border opacity-0 invisible select-none px-1 transition-all duration-200',
                hasIcon ? 'ml-9' : 'ml-2.5'
              )}
            >
              {label}
            </legend>
          </fieldset>
        </div>

        {error && errorMessage && (
          <p className="text-xs text-red-500 mt-1 pl-1">{errorMessage}</p>
        )}
      </div>
    );
  }
);

FloatingInput.displayName = 'FloatingInput';