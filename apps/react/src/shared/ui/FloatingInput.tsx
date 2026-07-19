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
      <div className="relative w-full">
        <Input
          {...props}
          ref={ref}
          placeholder=" "
          className={cn(
            'peer w-full rounded-md border border-zinc-800 bg-transparent text-zinc-200 focus-visible:ring-0 focus-visible:border-zinc-500 pt-3 pb-3 h-11 placeholder:opacity-0 transition-all',
            error && 'border-red-500/80 focus-visible:border-red-500',
            className
          )}
        />
        <label
          className={cn(
            'absolute left-4 top-0 -translate-y-1/2 pointer-events-none text-[10px] font-sans transition-all duration-200 ease-in-out origin-left px-1',
            'bg-slate-950/70 backdrop-blur-md text-slate-400',
            'peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-xs peer-placeholder-shown:text-zinc-500 peer-placeholder-shown:bg-transparent peer-placeholder-shown:backdrop-blur-none',
            'peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-[10px] peer-focus:text-slate-400 peer-focus:bg-slate-950/70 peer-focus:backdrop-blur-md',
            error && 'text-red-400 bg-red-950/30',
            labelClasses
          )}
        >
          {label}
        </label>
      </div>
    );
  }
);

FloatingInput.displayName = 'FloatingInput';