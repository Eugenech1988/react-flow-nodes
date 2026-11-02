import React from 'react';
import { Input } from '@pipeline/ui';
import { cn } from '@/shared/lib';
import type { TRoundedSize } from '@/shared/lib';
import { ROUNDED_MAP } from '@/shared/lib';

interface FloatingInputProps extends React.ComponentProps<typeof Input> {
  label: string;
  icon?: React.ReactNode;
  error?: boolean;
  errorMessage?: string;
  labelClasses?: string;
  fieldsetClasses?: string;
  className?: string;
  rounded?: TRoundedSize;
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
    ref,
  ) => {
    const hasIcon = Boolean(icon);
    const roundedClass = ROUNDED_MAP[rounded] || ROUNDED_MAP.xl;

    return (
      <div className="w-full">
        <div className={cn('group relative flex h-11 w-full items-center', roundedClass)}>
          {/* Input перенесен вверх, чтобы стать peer для иконки */}
          <Input
            {...props}
            ref={ref}
            placeholder=" "
            className={cn(
              'peer relative z-10 h-full w-full border-0 bg-transparent py-0 transition-all placeholder:opacity-0 focus-visible:ring-0',
              roundedClass,
              hasIcon ? 'pr-3 pl-10' : 'px-3',
              'disabled:text-muted-foreground/70 disabled:cursor-not-allowed',
              error
                ? 'text-red-500! [-webkit-text-fill-color:var(--color-red-500)]! autofill:[-webkit-text-fill-color:var(--color-red-500)]!'
                : 'text-foreground autofill:[-webkit-text-fill-color:var(--foreground)]!',
              className,
            )}
          />

          {/* Иконка (идет после Input): реагирует на peer-focus и peer-[:not(:placeholder-shown)] */}
          {hasIcon && (
            <div
              className={cn(
                'pointer-events-none absolute top-1/2 left-3.5 z-20 -translate-y-1/2 transition-colors duration-200',
                'text-zinc-400 dark:text-zinc-500',
                'group-hover:text-teal-500 dark:group-hover:text-teal-500',
                'peer-focus:text-teal-500 dark:peer-focus:text-teal-500',
                'peer-[:not(:placeholder-shown)]:text-teal-500 dark:peer-[:not(:placeholder-shown)]:text-teal-500',
                'peer-disabled:text-muted-foreground/40 peer-disabled:group-hover:text-muted-foreground/40',
                error && 'text-red-500!',
              )}
            >
              {icon}
            </div>
          )}

          <label
            className={cn(
              'pointer-events-none absolute top-1/2 z-20 block max-w-[calc(100%-24px)] origin-left -translate-y-1/2 truncate font-sans text-sm text-ellipsis transition-all duration-200 ease-in-out select-none',
              hasIcon ? 'left-10' : 'left-3.5',
              'text-zinc-400 dark:text-zinc-500',
              'group-hover:text-teal-500 dark:group-hover:text-teal-500',
              'peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-[10px] peer-focus:text-teal-500 peer-focus-visible:text-teal-500',
              'peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:-translate-y-1/2 peer-not-placeholder-shown:text-[10px] peer-not-placeholder-shown:text-teal-500',
              'peer-disabled:text-muted-foreground/60! peer-disabled:group-hover:text-muted-foreground/60! peer-disabled:top-0! peer-disabled:-translate-y-1/2! peer-disabled:text-[10px]!',
              error
                ? 'text-red-500!'
                : 'group-hover:text-teal-500 peer-not-placeholder-shown:text-teal-500 peer-focus:text-teal-500 peer-focus-visible:text-teal-500 dark:group-hover:text-teal-500 dark:peer-not-placeholder-shown:text-teal-500 dark:peer-focus:text-teal-500 dark:peer-focus-visible:text-teal-500',
              labelClasses,
            )}
          >
            {label}
          </label>

          <fieldset
            className={cn(
              'pointer-events-none absolute inset-0 -top-1.5 z-0 m-0 box-border min-w-0 border transition-all duration-200',
              roundedClass,
              '[&_legend]:invisible [&_legend]:max-w-0 [&_legend]:p-0 [&_legend]:transition-all [&_legend]:duration-200',
              'peer-focus:[&_legend]:visible peer-focus:[&_legend]:max-w-full peer-focus:[&_legend]:px-1',
              'peer-not-placeholder-shown:[&_legend]:visible peer-not-placeholder-shown:[&_legend]:max-w-full peer-not-placeholder-shown:[&_legend]:px-1',
              'autofill:[&_legend]:visible autofill:[&_legend]:max-w-full autofill:[&_legend]:px-1',
              'peer-disabled:bg-muted/30 peer-disabled:border-border/60 peer-disabled:[&_legend]:visible peer-disabled:[&_legend]:max-w-full peer-disabled:[&_legend]:px-1',
              error
                ? 'border-red-500! shadow-[0_0_15px_rgba(239,68,68,0.02)]'
                : 'border-zinc-400 group-hover:border-teal-500 peer-not-placeholder-shown:border-teal-500 peer-focus:border-teal-500 peer-focus-visible:border-teal-500 hover:border-teal-500 dark:border-zinc-500 dark:group-hover:border-teal-500 dark:peer-not-placeholder-shown:border-teal-500 dark:peer-focus:border-teal-500 dark:peer-focus-visible:border-teal-500 dark:hover:border-teal-500',
              fieldsetClasses,
            )}
          >
            <legend
              className={cn(
                'pointer-events-none invisible box-border block h-3 w-auto px-1 font-sans text-[10px] whitespace-nowrap opacity-0 transition-all duration-200 select-none',
                hasIcon ? 'ml-9' : 'ml-2.5',
              )}
            >
              {label}
            </legend>
          </fieldset>
        </div>

        {error && errorMessage && <p className="mt-1 pl-1 text-xs text-red-500">{errorMessage}</p>}
      </div>
    );
  },
);

FloatingInput.displayName = 'FloatingInput';
