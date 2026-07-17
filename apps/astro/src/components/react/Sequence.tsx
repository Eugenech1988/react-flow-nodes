import React from 'react';

interface StepProps {
  number?: number;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export const Step = ({ number, title, subtitle, children }: StepProps) => {
  return (
    <div className="relative pl-8 sm:pl-10 group">
      <div className="absolute left-2.75 top-7 bottom-0 w-0.5 bg-slate-800 group-last:hidden" />

      <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-xs font-mono font-bold text-teal-400 shadow-[0_0_10px_var(--color-teal-500/10)]">
        {number}
      </div>

      <div className="pb-8">
        <div className="flex flex-wrap items-baseline gap-2 mb-1">
          <h3 className="text-md font-bold text-slate-200">{title}</h3>
          {subtitle && (
            <span className="text-xs text-slate-500 font-mono">({subtitle})</span>
          )}
        </div>
        <div className="text-xs text-slate-400 leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
}

interface SequenceProps {
  children: React.ReactNode;
}

export function Sequence({ children }: SequenceProps) {
  return (
    <div className="relative flex flex-col">
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement<StepProps>(child)) {
          return React.cloneElement(child, {
            number: index + 1
          });
        }
        return child;
      })}
    </div>
  );
}