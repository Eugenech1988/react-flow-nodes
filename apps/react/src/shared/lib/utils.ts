import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const debounce = <T extends (...args: unknown[]) => void>(fn: T, delay: number) => {
  let timer: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timer);

    timer = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};

const VARIABLE_PATTERN = /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g;

export const extractVariables = (text: string): string[] => {
  const uniqueVariables: string[] = [];
  const seenNames = new Set<string>();
  const pattern = new RegExp(VARIABLE_PATTERN);
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    const variableName = match[1];
    if (!seenNames.has(variableName)) {
      seenNames.add(variableName);
      uniqueVariables.push(variableName);
    }
  }

  return uniqueVariables;
};

const getBrowserLocale = (): string => {
  if (typeof navigator === 'undefined') return 'en-US';
  return navigator.language || 'en-US';
};

export const formatDuration = (durationMs: number | null | undefined): string => {
  if (durationMs == null || isNaN(durationMs)) return '00:00.00';

  const minutes = Math.floor(durationMs / 60000);
  const seconds = Math.floor((durationMs % 60000) / 1000);
  const centiseconds = Math.floor((durationMs % 1000) / 10);

  const pad = (num: number) => String(num).padStart(2, '0');

  return `${pad(minutes)}:${pad(seconds)}.${pad(centiseconds)}`;
};

export const formatDate = (
  dateInput: string | number | Date | null | undefined,
  options?: { showTime?: boolean },
): string => {
  if (dateInput == null) return '—';

  const date =
    typeof dateInput === 'number'
      ? new Date(dateInput)
      : typeof dateInput === 'string'
        ? new Date(dateInput)
        : dateInput;

  if (isNaN(date.getTime())) return '—';

  const showTime = options?.showTime ?? true;

  return new Intl.DateTimeFormat(getBrowserLocale(), {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    ...(showTime && {
      hour: '2-digit',
      minute: '2-digit',
    }),
  }).format(date);
};

export const formatTimestamp = (ts: number | string): string => {
  if (!ts) return '';

  let date: Date;

  if (typeof ts === 'number') {
    date = new Date(ts);
  } else if (!isNaN(Number(ts))) {
    date = new Date(Number(ts));
  } else {
    date = new Date(ts);
  }

  if (!isNaN(date.getTime())) {
    return date.toLocaleTimeString(getBrowserLocale(), {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  }

  return String(ts);
};
