import { vi, describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { ServerStatusBadge } from './ServerStatusBadge';

const fetchMock = vi.fn();

vi.stubGlobal('fetch', fetchMock);

describe('ServerStatusBadge', () => {
  beforeEach(() => {
    fetchMock.mockClear();
  });

  it('should show status "online" if status 200', async () => {
    fetchMock.mockResolvedValueOnce({ ok: true });

    render(<ServerStatusBadge />);

    await waitFor(() => {
      expect(screen.getByText('Backend online')).toBeDefined();
    });
  });
  it('should show status "online" if status 404', async () => {
    fetchMock.mockResolvedValueOnce({ ok: false });

    render(<ServerStatusBadge />);

    await waitFor(() => {
      expect(screen.getByText('Backend offline')).toBeDefined();
    });
  });
});