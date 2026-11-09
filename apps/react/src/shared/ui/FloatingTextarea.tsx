import React from 'react';
import { Textarea } from '@pipeline/ui';
import { cn } from '@/shared/lib';
import type { TRoundedSize } from '@/shared/lib';
import { ROUNDED_MAP } from '@/shared/lib';

interface FloatingTextareaProps extends React.ComponentProps<typeof Textarea> {
  label: string;
  error?: boolean;
  errorMessage?: string;
  labelClasses?: string;
  fieldsetClasses?: string;
  rounded?: TRoundedSize;
}

export const FloatingTextarea = React.forwardRef<HTMLTextAreaElement, FloatingTextareaProps>(
  (
    {
      label,
      error,
      errorMessage,
      className = '',
      labelClasses = '',
      fieldsetClasses = '',
      rows = 3,
      rounded = 'md',
      ...props
    },
    ref,
  ) => {
    const hasValue = Boolean(props.value && String(props.value).trim() !== '');
    const roundedClass = ROUNDED_MAP[rounded] || ROUNDED_MAP.xl;

    return (
      <div className="w-full">
        <div className={cn('group relative flex w-full items-center', roundedClass)}>
          <Textarea
            {...props}
            ref={ref}
            rows={rows}
            placeholder=" "
            className={cn(
              'peer relative z-10 min-h-[80px] w-full resize-y border-0 bg-transparent px-3.5 py-3 transition-all placeholder:opacity-0 focus-visible:ring-0',
              roundedClass,
              'disabled:text-muted-foreground/60 disabled:cursor-not-allowed',
              error
                ? 'text-red-500! [-webkit-text-fill-color:var(--color-red-500)]! autofill:[-webkit-text-fill-color:var(--color-red-500)]!'
                : 'text-foreground autofill:[-webkit-text-fill-color:var(--foreground)]!',
              className,
            )}
          />

          <label
            className={cn(
              'pointer-events-none absolute top-3.5 left-3.5 z-20 block max-w-[calc(100%-24px)] origin-left -translate-y-0 truncate font-sans text-sm text-ellipsis transition-all duration-200 ease-in-out select-none',
              'text-zinc-400 dark:text-zinc-500',
              'group-hover:text-teal-500 dark:group-hover:text-teal-500',
              'peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-[10px] peer-focus:text-teal-500 peer-focus-visible:text-teal-500',
              'peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:-translate-y-1/2 peer-not-placeholder-shown:text-[10px] peer-not-placeholder-shown:text-teal-500',
              hasValue && 'top-0 -translate-y-1/2 text-[10px] text-teal-500',
              error ? 'text-red-500!' : hasValue && 'text-teal-500 dark:text-teal-500',
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
              hasValue && '[&_legend]:visible [&_legend]:max-w-full [&_legend]:px-1',
              'peer-disabled:bg-muted/30 peer-disabled:border-border/40 peer-disabled:opacity-80',
              error
                ? 'border-red-500! shadow-[0_0_15px_rgba(239,68,68,0.02)]'
                : 'border-zinc-400 group-hover:border-teal-500 peer-not-placeholder-shown:border-teal-500 peer-focus:border-teal-500 peer-focus-visible:border-teal-500 hover:border-teal-500 dark:border-zinc-500 dark:group-hover:border-teal-500 dark:hover:border-teal-500',
              hasValue && '!border-teal-500 dark:!border-teal-500',
              fieldsetClasses,
            )}
          >
            <legend
              className={cn(
                'pointer-events-none invisible ml-2.5 box-border block h-3 w-auto px-1 font-sans text-[10px] whitespace-nowrap opacity-0 transition-all duration-200 select-none',
                hasValue && 'visible',
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

FloatingTextarea.displayName = 'FloatingTextarea';
