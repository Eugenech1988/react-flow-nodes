import React, { useId } from 'react';
import { ChevronDown } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@pipeline/ui';
import { cn } from '@/shared/lib';

export interface FloatingSelectOption {
  value: string;
  label: string;
}

export interface FloatingSelectProps {
  label: string;
  value?: string;
  onChange?: (value: string) => void;
  options: FloatingSelectOption[];
  placeholder?: string;
  error?: boolean;
  errorMessage?: string;
  disabled?: boolean;
  className?: string;
  labelClasses?: string;
  fieldsetClasses?: string;
  renderValue?: (value: string) => React.ReactNode;
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
                                                              }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const id = useId();

  const hasValue = Boolean(value && value.trim() !== '');
  const isFloating = hasValue || isOpen;
  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className="w-full pt-2">
      <div className="relative w-full group">
        <Select
          value={value || undefined}
          onValueChange={onChange}
          onOpenChange={setIsOpen}
          disabled={disabled}
        >
          <SelectTrigger
            id={id}
            className={cn(
              'peer w-full rounded-md border-0 bg-transparent focus:ring-0 focus-visible:ring-0 focus:outline-none px-3 pt-3 pb-3 h-11 transition-all z-10 relative flex items-center justify-between shadow-none cursor-pointer [&>svg]:hidden',
              'disabled:cursor-not-allowed disabled:text-muted-foreground/60',
              error
                ? 'text-red-500! [-webkit-text-fill-color:var(--color-red-500)]!'
                : 'text-foreground',
              className
            )}
          >
            <div className="truncate text-left font-normal text-sm flex-1 pr-6">
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
              'absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 shrink-0 transition-transform duration-200 z-20 pointer-events-none',
              isOpen && 'rotate-180',
              error
                ? 'text-red-500'
                : 'text-muted-foreground group-hover:text-foreground'
            )}
          />

          <label
            htmlFor={id}
            className={cn(
              'absolute left-3 top-0 -translate-y-1/2 pointer-events-none text-[10px] font-sans transition-all duration-200 ease-in-out z-20 block select-none max-w-[calc(100%-36px)] truncate text-ellipsis origin-left',
              !isFloating && 'top-1/2 -translate-y-1/2 text-sm text-muted-foreground/80',
              disabled && 'text-muted-foreground/50',
              error
                ? 'text-red-500!'
                : isOpen || hasValue
                  ? 'text-foreground'
                  : 'text-muted-foreground/80 group-hover:text-foreground',
              isFloating && 'top-0 -translate-y-1/2 text-[10px]',
              labelClasses
            )}
          >
            {label}
          </label>

          <fieldset
            className={cn(
              'pointer-events-none absolute inset-0 -top-1.5 m-0 min-w-0 rounded-md border transition-all duration-200 z-0 box-border',
              '[&_legend]:max-w-0 [&_legend]:transition-all [&_legend]:duration-200 [&_legend]:p-0 [&_legend]:invisible',
              isFloating && '[&_legend]:max-w-full [&_legend]:px-1 [&_legend]:visible',
              disabled && 'bg-muted/30 border-border/40 opacity-80',
              error
                ? 'border-red-500! shadow-[0_0_15px_rgba(239,68,68,0.02)]'
                : isOpen || hasValue
                  ? 'border-foreground'
                  : 'border-input group-hover:border-muted-foreground/50',
              fieldsetClasses
            )}
          >
            <legend
              className={cn(
                'h-3 text-[10px] font-sans pointer-events-none block w-auto whitespace-nowrap box-border ml-2 opacity-0 invisible select-none px-1 text-transparent overflow-hidden',
                isFloating && 'visible'
              )}
            >
              {label}
            </legend>
          </fieldset>

          <SelectContent className="bg-card border-border rounded-xl shadow-lg z-50">
            {options.map((opt) => (
              <SelectItem
                key={opt.value}
                value={opt.value}
                className="text-xs cursor-pointer rounded-lg hover:bg-muted/60 transition-colors"
              >
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {error && errorMessage && (
        <p className="text-xs text-red-500 mt-1 pl-1">{errorMessage}</p>
      )}
    </div>
  );
};

FloatingSelect.displayName = 'FloatingSelect';