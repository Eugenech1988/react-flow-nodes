import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SubmitButton } from './SubmitButton';
import type { ReactNode } from 'react';

const { getStateMock } = vi.hoisted(() => ({
  getStateMock: vi.fn(),
}));

// Делаем useStore функцией-заглушкой, у которой также есть метод getState
vi.mock('@/entities', () => {
  const mockStoreHook = () => ({
    nodes: [{ id: '1' }],
    edges: [{ id: 'e1' }],
  });
  mockStoreHook.getState = getStateMock;
  return {
    useStore: mockStoreHook,
  };
});

vi.mock('@/shared/ui', () => ({
  Button: ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button {...props}>{children}</button>
  ),
  Dialog: ({
             isOpen,
             title,
             children
           }: {
    isOpen: boolean;
    title: string;
    children: ReactNode
  }) => (isOpen ? (
    <div data-testid="dialog">
      <h2>{title}</h2>
      {children}
    </div>
  ) : null),
}));

describe('SubmitButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    getStateMock.mockReturnValue({
      nodes: [{ id: '1' }],
      edges: [{ id: 'e1' }],
    });

    vi.stubGlobal('fetch', vi.fn());
  });

  it('submits pipeline successfully', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({
        num_nodes: 5,
        num_edges: 4,
        is_dag: true,
      }),
    } as Response);

    render(<SubmitButton />);

    fireEvent.click(screen.getByRole('button', { name: /submit pipeline/i }));

    await waitFor(() =>
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8000/pipelines/parse',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nodes: [{ id: '1' }],
            edges: [{ id: 'e1' }],
          }),
        }
      )
    );

    expect(await screen.findByText('Pipeline Analysis')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('Yes')).toBeInTheDocument();
    expect(
      screen.getByText(/Success! No cycles detected/i)
    ).toBeInTheDocument();
  });

  it('shows server error', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 500,
    } as Response);

    render(<SubmitButton />);

    fireEvent.click(screen.getByRole('button', { name: /submit pipeline/i }));

    expect(await screen.findByText('Submission Failed')).toBeInTheDocument();
    expect(
      screen.getByText('Server responded with status 500')
    ).toBeInTheDocument();
  });

  it('shows network error', async () => {
    vi.mocked(fetch).mockRejectedValue(new TypeError('Network Error'));

    render(<SubmitButton />);

    fireEvent.click(screen.getByRole('button', { name: /submit pipeline/i }));

    expect(await screen.findByText('Submission Failed')).toBeInTheDocument();
    expect(
      screen.getByText(/Couldn't reach the backend/i)
    ).toBeInTheDocument();
  });

  it('closes dialog', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({
        num_nodes: 2,
        num_edges: 1,
        is_dag: true,
      }),
    } as Response);

    render(<SubmitButton />);

    fireEvent.click(screen.getByRole('button', { name: /submit pipeline/i }));

    expect(await screen.findByTestId('dialog')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /close/i }));

    await waitFor(() =>
      expect(screen.queryByTestId('dialog')).not.toBeInTheDocument()
    );
  });
});