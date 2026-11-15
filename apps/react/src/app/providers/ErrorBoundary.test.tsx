import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { ErrorBoundary } from './ErrorBoundary';

const Thrower = ({ message }: { message: string }): ReactNode => {
  throw new Error(message);
};

describe('ErrorBoundary', () => {
  const originalError = console.error;
  const originalFetch = globalThis.fetch;
  const fetchMock = vi.fn();

  beforeEach(() => {
    console.error = vi.fn();
    fetchMock.mockReset();
    fetchMock.mockResolvedValue(new Response(null, { status: 200 }));
    globalThis.fetch = fetchMock as unknown as typeof fetch;
  });

  afterEach(() => {
    console.error = originalError;
    globalThis.fetch = originalFetch;
    vi.unstubAllEnvs();
  });

  it('renders children when no error', () => {
    render(
      <ErrorBoundary>
        <span>ok</span>
      </ErrorBoundary>,
    );

    expect(screen.getByText('ok')).toBeInTheDocument();
  });

  it('renders FatalErrorState when child throws', () => {
    render(
      <ErrorBoundary>
        <Thrower message="kaboom" />
      </ErrorBoundary>,
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('kaboom')).toBeInTheDocument();
  });

  it('renders custom fallback when provided', () => {
    render(
      <ErrorBoundary fallback={<span>custom fallback</span>}>
        <Thrower message="kaboom" />
      </ErrorBoundary>,
    );

    expect(screen.getByText('custom fallback')).toBeInTheDocument();
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
  });

  it('does not call fetch when VITE_ERROR_REPORT_URL missing', () => {
    vi.stubEnv('VITE_ERROR_REPORT_URL', '');

    render(
      <ErrorBoundary>
        <Thrower message="kaboom" />
      </ErrorBoundary>,
    );

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('reports error to VITE_ERROR_REPORT_URL when defined', () => {
    vi.stubEnv('VITE_ERROR_REPORT_URL', 'https://errors.example.com');

    render(
      <ErrorBoundary>
        <Thrower message="kaboom" />
      </ErrorBoundary>,
    );

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('https://errors.example.com');
    expect(init.method).toBe('POST');
    const body = JSON.parse(String(init.body)) as { message: string };
    expect(body.message).toBe('kaboom');
  });
});