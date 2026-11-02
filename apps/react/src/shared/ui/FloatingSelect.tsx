import React, { useId } from 'react';
import { ChevronDown } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@pipeline/ui';
import { cn } from '@/shared/lib';
import type { TRoundedSize } from '@/shared/lib';
import { ROUNDED_MAP } from '@/shared/lib';

export type TFloatingSelectOption = {
  value: string;
  label: string;
};

export interface FloatingSelectProps {
  label: string;
  value?: string;
  onChange?: (value: string) => void;
  options: TFloatingSelectOption[];
  placeholder?: string;
  error?: boolean;
  errorMessage?: string;
  disabled?: boolean;
  className?: string;
  labelClasses?: string;
  fieldsetClasses?: string;
  renderValue?: (value: string) => React.ReactNode;
  rounded?: TRoundedSize;
}

export const FloatingSelect: React.FC<FloatingSelectProps> = ({
  label,
  value,
  onChange,
  options,
  error,
  errorMessage,
  disabled = false,
  className = '',
  labelClasses = '',
  fieldsetClasses = '',
  renderValue,
  rounded = 'xl',
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const id = useId();

  const hasValue = Boolean(value && value.trim() !== '');
  const selectedOption = options.find((opt) => opt.value === value);
  const roundedClass = ROUNDED_MAP[rounded] || ROUNDED_MAP.xl;

  const handleValueChange = (val: string | null) => {
    if (val !== null) {
      onChange?.(val);
    }
  };

  return (
    <div className="w-full">
      <div className={cn('group relative flex h-11 w-full items-center', roundedClass)}>
        <Select
          value={value || undefined}
          onValueChange={handleValueChange}
          onOpenChange={setIsOpen}
          disabled={disabled}
        >
          <SelectTrigger
            id={id}
            className={cn(
              'peer relative z-10 flex h-full w-full cursor-pointer items-center justify-between border-0 bg-transparent px-3 py-0 shadow-none transition-all focus:ring-0 focus:outline-none focus-visible:ring-0 [&>svg]:hidden',
              roundedClass,
              'disabled:text-muted-foreground/60 disabled:cursor-not-allowed',
              error
                ? 'text-red-500! [-webkit-text-fill-color:var(--color-red-500)]!'
                : 'text-foreground',
              className,
            )}
          >
            <div className="flex-1 truncate pr-6 text-left text-sm font-normal">
              <SelectValue placeholder="">
                {hasValue
                  ? renderValue
                    ? renderValue(value!)
                    : selectedOption?.label || value
                  : null}
              </SelectValue>
            </div>
          </SelectTrigger>

          <ChevronDown
            className={cn(
              'pointer-events-none absolute top-1/2 right-3.5 z-20 h-4 w-4 shrink-0 -translate-y-1/2 transition-transform duration-200',
              isOpen && 'rotate-180',
              error
                ? 'text-red-500'
                : 'text-zinc-400 group-hover:text-teal-500 dark:text-zinc-500 dark:group-hover:text-teal-500',
            )}
          />

          <label
            htmlFor={id}
            className={cn(
              'pointer-events-none absolute top-1/2 left-3.5 z-20 block max-w-[calc(100%-36px)] origin-left -translate-y-1/2 truncate font-sans text-sm text-ellipsis transition-all duration-200 ease-in-out select-none',
              'text-zinc-400 dark:text-zinc-500',
              'group-hover:text-teal-500 dark:group-hover:text-teal-500',
              (isOpen || hasValue) && 'top-0 -translate-y-1/2 text-[10px] text-teal-500',
              error ? 'text-red-500!' : (isOpen || hasValue) && 'text-teal-500 dark:text-teal-500',
              disabled && 'text-muted-foreground/50',
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
              (isOpen || hasValue) && '[&_legend]:visible [&_legend]:max-w-full [&_legend]:px-1',
              'peer-disabled:bg-muted/30 peer-disabled:border-border/40 peer-disabled:opacity-80',
              error
                ? 'border-red-500! shadow-[0_0_15px_rgba(239,68,68,0.02)]'
                : 'border-zinc-400 group-hover:border-teal-500 hover:border-teal-500 dark:border-zinc-500 dark:group-hover:border-teal-500 dark:hover:border-teal-500',
              (isOpen || hasValue) && '!border-teal-500 dark:!border-teal-500',
              fieldsetClasses,
            )}
          >
            <legend
              className={cn(
                'pointer-events-none invisible ml-2.5 box-border block h-3 w-auto px-1 font-sans text-[10px] whitespace-nowrap opacity-0 transition-all duration-200 select-none',
                (isOpen || hasValue) && 'visible',
              )}
            >
              {label}
            </legend>
          </fieldset>

          <SelectContent className="bg-card border-border z-50 rounded-xl shadow-lg">
            {options.map((opt) => (
              <SelectItem
                key={opt.value}
                value={opt.value}
                className="hover:bg-muted/60 cursor-pointer rounded-lg text-xs transition-colors"
              >
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {error && errorMessage && <p className="mt-1 pl-1 text-xs text-red-500">{errorMessage}</p>}
    </div>
  );
};

FloatingSelect.displayName = 'FloatingSelect';
