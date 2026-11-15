import { AlertTriangle } from 'lucide-react';
import { AppButton } from './AppButton';

interface IFatalErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryText?: string;
  showRetry?: boolean;
}

export const FatalErrorState = ({
                                  title = 'Something went wrong',
                                  message,
                                  onRetry,
                                  retryText = 'Retry',
                                  showRetry = true,
                                }: IFatalErrorStateProps) => {
  const handleRetry = (): void => {
    if (onRetry) {
      onRetry();
      return;
    }
    window.location.reload();
  };

  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center transition-colors">
      <div className="border-destructive/30 bg-destructive/10 flex h-14 w-14 items-center justify-center rounded-full border">
        <AlertTriangle className="text-destructive h-7 w-7" />
      </div>
      <h1 className="text-foreground text-xl font-semibold tracking-tight">{title}</h1>
      <p className="text-muted-foreground max-w-md text-sm leading-relaxed">{message}</p>
      {showRetry && (
        <AppButton
          variant="primary"
          size="md"
          text={retryText}
          onClick={handleRetry}
          className="mt-2"
        />
      )}
    </div>
  );
};