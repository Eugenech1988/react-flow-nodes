import { Component, type ErrorInfo, type ReactNode } from 'react';

interface IProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface IState {
  hasError: boolean;
  error?: Error;
}

const reportError = (error: Error, errorInfo: ErrorInfo): void => {
  console.error('Unhandled render error:', error, errorInfo);

  const endpoint = import.meta.env.VITE_ERROR_REPORT_URL;
  if (!endpoint) return;

  try {
    void fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
      }),
      keepalive: true,
    });
  } catch {
    // swallow
  }
};

export class ErrorBoundary extends Component<IProps, IState> {
  state: IState = { hasError: false };

  static getDerivedStateFromError(error: Error): IState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    reportError(error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    if (this.props.fallback) return this.props.fallback;

    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 p-8 text-center">
        <h1 className="text-xl font-semibold">Something went wrong</h1>
        <p className="text-muted-foreground max-w-md text-sm">
          {this.state.error?.message ?? 'An unexpected error occurred.'}
        </p>
        <button
          type="button"
          className="bg-primary text-primary-foreground mt-2 rounded-xl px-4 py-2 text-sm font-medium"
          onClick={() => window.location.reload()}
        >
          Reload
        </button>
      </div>
    );
  }
}
