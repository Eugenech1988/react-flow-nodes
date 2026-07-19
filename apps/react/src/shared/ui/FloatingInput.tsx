import React from 'react';
import { Input } from '@pipeline/ui';
import { cn } from '@/shared/lib';

interface FloatingInputProps extends React.ComponentProps<typeof Input> {
  label: string;
  error?: boolean;
  labelClasses?: string;
}

export const FloatingInput = React.forwardRef<HTMLInputElement, FloatingInputProps>(
  ({ label, error, className = '', labelClasses = '', ...props }, ref) => {
    return (
      <div className="w-full pt-2">
        <div className="relative w-full group">
          <Input
            {...props}
            ref={ref}
            placeholder=" "
            className={cn(
              'peer w-full rounded-md border-0 bg-transparent focus-visible:ring-0 px-3 pt-3 pb-3 h-11 placeholder:opacity-0 transition-all z-10 relative',
              error
                ? '!text-red-500 ![-webkit-text-fill-color:theme(colors.red.500)] autofill:![-webkit-text-fill-color:theme(colors.red.500)]'
                : 'text-zinc-200 autofill:![-webkit-text-fill-color:theme(colors.slate.400)]',
              className
            )}
          />

          <label
            className={cn(
              'absolute left-3 top-0 -translate-y-1/2 pointer-events-none text-[10px] font-sans transition-all duration-200 ease-in-out z-20 block select-none max-w-[calc(100%-24px)] truncate text-ellipsis origin-left',
              'peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm',
              error
                ? '!text-red-500'
                : 'text-zinc-500 peer-focus:text-slate-400 peer-focus-visible:text-slate-400 peer-not-placeholder-shown:text-slate-400 group-hover:text-slate-400',
              'peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-[10px]',
              labelClasses
            )}
          >
            {label}
          </label>

          <fieldset
            className={cn(
              'pointer-events-none absolute inset-0 -top-[6px] m-0 min-w-0 rounded-md border transition-all duration-200 z-0 box-border',
              '[&_legend]:max-w-0 [&_legend]:transition-all [&_legend]:duration-200 [&_legend]:p-0 [&_legend]:invisible',
              'peer-focus:[&_legend]:max-w-full peer-focus:[&_legend]:px-1 peer-focus:[&_legend]:visible',
              'peer-not-placeholder-shown:[&_legend]:max-w-full peer-not-placeholder-shown:[&_legend]:px-1 peer-not-placeholder-shown:[&_legend]:visible',
              'autofill:[&_legend]:max-w-full autofill:[&_legend]:px-1 autofill:[&_legend]:visible',
              error
                ? '!border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.02)]'
                : 'border-zinc-600 group-hover:border-slate-400 peer-focus:border-slate-400 peer-focus-visible:border-slate-400 peer-not-placeholder-shown:border-slate-400'
            )}
          >
            <legend className="h-3 text-[10px] font-sans pointer-events-none block w-auto whitespace-nowrap box-border ml-2.5 opacity-0 invisible select-none px-1">
              {label}
            </legend>
          </fieldset>
        </div>
      </div>
    );
  }
);

FloatingInput.displayName = 'FloatingInput';