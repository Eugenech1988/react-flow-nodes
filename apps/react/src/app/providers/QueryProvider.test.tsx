import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { QueryProvider } from './QueryProvider';

vi.mock('@tanstack/react-query-devtools', () => ({
  ReactQueryDevtools: () => <div data-testid="devtools" />,
}));

vi.mock('./AuthFailureHandler', () => ({
  AuthFailureHandler: () => <div data-testid="auth-failure-handler" />,
}));

vi.mock('@/shared/api', async () => {
  const actual = await vi.importActual<typeof import('@/shared/api')>('@/shared/api');
  return {
    ...actual,
    TRPCProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    trpcClient: {},
  };
});

describe('QueryProvider', () => {
  it('renders children', () => {
    render(
      <QueryProvider>
        <div data-testid="child" />
      </QueryProvider>,
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('renders AuthFailureHandler', () => {
    render(
      <QueryProvider>
        <div />
      </QueryProvider>,
    );
    expect(screen.getByTestId('auth-failure-handler')).toBeInTheDocument();
  });
});
