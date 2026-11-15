import { afterEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { FatalErrorState } from './FatalErrorState';

describe('FatalErrorState', () => {
  const originalLocation = window.location;

  afterEach(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: originalLocation,
    });
  });

  it('renders default title and message', () => {
    render(<FatalErrorState message="boom" />);

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('boom')).toBeInTheDocument();
  });

  it('renders custom title', () => {
    render(<FatalErrorState title="Server unreachable" message="boom" />);

    expect(screen.getByText('Server unreachable')).toBeInTheDocument();
  });

  it('renders retry button by default', () => {
    render(<FatalErrorState message="boom" />);

    expect(screen.getByText('Retry')).toBeInTheDocument();
  });

  it('hides retry button when showRetry=false', () => {
    render(<FatalErrorState message="boom" showRetry={false} />);

    expect(screen.queryByText('Retry')).not.toBeInTheDocument();
  });

  it('reloads the page when retry clicked without onRetry', () => {
    const reload = vi.fn();
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { ...originalLocation, reload },
    });

    render(<FatalErrorState message="boom" />);
    fireEvent.click(screen.getByText('Retry'));

    expect(reload).toHaveBeenCalledTimes(1);
  });

  it('calls onRetry and does not reload when onRetry provided', () => {
    const onRetry = vi.fn();
    const reload = vi.fn();
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { ...originalLocation, reload },
    });

    render(<FatalErrorState message="boom" onRetry={onRetry} />);
    fireEvent.click(screen.getByText('Retry'));

    expect(onRetry).toHaveBeenCalledTimes(1);
    expect(reload).not.toHaveBeenCalled();
  });

  it('renders custom retry text', () => {
    render(<FatalErrorState message="boom" retryText="Попробовать снова" />);

    expect(screen.getByText('Попробовать снова')).toBeInTheDocument();
  });
});