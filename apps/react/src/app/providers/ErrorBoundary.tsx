import { Component, type ErrorInfo, type ReactNode } from 'react';
import { FatalErrorState } from '@/shared/ui';

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
      <FatalErrorState
        message={this.state.error?.message ?? 'An unexpected error occurred.'}
      />
    );
  }
}