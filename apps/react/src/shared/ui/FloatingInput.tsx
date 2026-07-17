import React from 'react';
import { Input } from '@pipeline/ui';

interface FloatingInputProps extends React.ComponentProps<typeof Input> {
  label: string;
  error?: boolean;
}

export const FloatingInput = React.forwardRef<HTMLInputElement, FloatingInputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="relative w-full">
        <Input
          {...props}
          ref={ref}
          placeholder=" "
          className={`peer w-full rounded-md border border-zinc-800 bg-transparent text-zinc-200 focus-visible:ring-0 focus-visible:border-zinc-500 pt-3 pb-3 h-11 placeholder:opacity-0 transition-all ${
            error ? 'border-red-500/80 focus-visible:border-red-500' : ''
          } ${className}`}
        />
        <label
          className="absolute left-3 top-0 -translate-y-1/2 pointer-events-none text-[10px] text-zinc-400 font-sans transition-all duration-200 ease-in-out origin-left px-1 bg-slate-950
          peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-xs peer-placeholder-shown:text-zinc-500 peer-placeholder-shown:bg-transparent
          peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-[10px] peer-focus:text-zinc-400 peer-focus:bg-slate-950"
        >
          {label}
        </label>
      </div>
    );
  }
);

FloatingInput.displayName = 'FloatingInput';