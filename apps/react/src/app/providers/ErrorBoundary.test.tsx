import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ErrorBoundary } from './ErrorBoundary';

const ErrorComponent = () => {
  throw new Error('Test render error');
};

const ErrorNoMessageComponent = () => {
  throw new Error();
};

describe('ErrorBoundary', () => {
  const mockFetch = vi.fn();
  const originalFetch = global.fetch;
  const originalConsoleError = console.error;

  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = mockFetch;
    console.error = vi.fn();
    vi.stubEnv('VITE_ERROR_REPORT_URL', 'https://error.log/api');
  });

  afterEach(() => {
    global.fetch = originalFetch;
    console.error = originalConsoleError;
    vi.unstubAllEnvs();
  });

  it('renders children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <div data-testid="content">All good</div>
      </ErrorBoundary>,
    );
    expect(screen.getByTestId('content')).toBeInTheDocument();
  });

  it('renders default fallback with error message', () => {
    render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>,
    );
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Test render error')).toBeInTheDocument();
  });

  it('renders custom fallback when provided', () => {
    render(
      <ErrorBoundary fallback={<div data-testid="custom-fallback">Custom Error</div>}>
        <ErrorComponent />
      </ErrorBoundary>,
    );
    expect(screen.getByTestId('custom-fallback')).toBeInTheDocument();
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
  });

  it('renders default message when error has no message', () => {
    render(
      <ErrorBoundary>
        <ErrorNoMessageComponent />
      </ErrorBoundary>,
    );
    expect(screen.getByText('An unexpected error occurred.')).toBeInTheDocument();
  });

  it('POSTs error to VITE_ERROR_REPORT_URL', () => {
    render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>,
    );

    expect(mockFetch).toHaveBeenCalledWith(
      'https://error.log/api',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        keepalive: true,
        body: expect.stringContaining('Test render error'),
      }),
    );
  });

  it('does not call fetch when VITE_ERROR_REPORT_URL is missing', () => {
    vi.unstubAllEnvs();

    render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>,
    );

    expect(mockFetch).not.toHaveBeenCalled();
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('reloads page on Reload button click', () => {
    const reloadMock = vi.fn();
    Object.defineProperty(window, 'location', {
      value: { reload: reloadMock },
      writable: true,
    });

    render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>,
    );

    fireEvent.click(screen.getByText('Reload'));
    expect(reloadMock).toHaveBeenCalledTimes(1);
  });
});
