interface ErrorBannerProps {
  message: string;
  onDismiss: () => void;
}

export const ErrorBanner = ({ message, onDismiss }: ErrorBannerProps) => {
  return (
    <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-sm flex items-center justify-between">
      <span>{message}</span>
      <button
        onClick={onDismiss}
        className="text-xs font-semibold hover:underline cursor-pointer"
      >
        Dismiss
      </button>
    </div>
  );
};