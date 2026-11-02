interface ErrorBannerProps {
  message: string;
  onDismiss: () => void;
}

export const ErrorBanner = ({ message, onDismiss }: ErrorBannerProps) => {
  return (
    <div className="flex items-center justify-between rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-600 dark:text-rose-400">
      <span>{message}</span>
      <button onClick={onDismiss} className="cursor-pointer text-xs font-semibold hover:underline">
        Dismiss
      </button>
    </div>
  );
};
