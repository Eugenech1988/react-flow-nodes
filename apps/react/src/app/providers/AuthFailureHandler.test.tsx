import { render } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthFailureHandler } from './AuthFailureHandler';

const {
  mockSetQueryData,
  mockOnAuthFailure,
  mockUnsubscribe,
  mockUseTRPC,
  mockClearStorage,
  mockResetGraph,
} = vi.hoisted(() => ({
  mockSetQueryData: vi.fn(),
  mockOnAuthFailure: vi.fn(),
  mockUnsubscribe: vi.fn(),
  mockUseTRPC: vi.fn(),
  mockClearStorage: vi.fn(),
  mockResetGraph: vi.fn(),
}));

vi.mock('@tanstack/react-query', async () => {
  const actual =
    await vi.importActual<typeof import('@tanstack/react-query')>('@tanstack/react-query');
  return {
    ...actual,
    useQueryClient: () => ({
      setQueryData: mockSetQueryData,
    }),
  };
});

vi.mock('@/shared/api', async () => {
  const actual = await vi.importActual<typeof import('@/shared/api')>('@/shared/api');
  return {
    ...actual,
    onAuthFailure: mockOnAuthFailure,
    useTRPC: () => mockUseTRPC(),
  };
});

vi.mock('@/entities', () => ({
  useStore: {
    persist: { clearStorage: mockClearStorage },
    getState: () => ({ resetGraph: mockResetGraph }),
  },
}));

const createTrpcMock = (tag: string) => ({
  auth: {
    me: {
      queryKey: () => ['auth', 'me', tag],
    },
  },
});

describe('AuthFailureHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockOnAuthFailure.mockReturnValue(mockUnsubscribe);
    mockUseTRPC.mockReturnValue(createTrpcMock('v1'));
  });

  it('renders nothing (returns null)', () => {
    const { container } = render(<AuthFailureHandler />);
    expect(container.firstChild).toBeNull();
  });

  it('registers auth failure listener on mount', () => {
    render(<AuthFailureHandler />);
    expect(mockOnAuthFailure).toHaveBeenCalledTimes(1);
  });

  it('calls useTRPC to obtain the tRPC client', () => {
    render(<AuthFailureHandler />);
    expect(mockUseTRPC).toHaveBeenCalled();
  });

  it('clears user cache, persist storage and resets graph on auth failure', () => {
    let callback: () => void = () => {};
    mockOnAuthFailure.mockImplementation((cb: () => void) => {
      callback = cb;
      return mockUnsubscribe;
    });

    render(<AuthFailureHandler />);
    callback();

    expect(mockSetQueryData).toHaveBeenCalledWith(['auth', 'me', 'v1'], null);
    expect(mockClearStorage).toHaveBeenCalledTimes(1);
    expect(mockResetGraph).toHaveBeenCalledTimes(1);
  });

  it('unsubscribes from auth failure on unmount', () => {
    const { unmount } = render(<AuthFailureHandler />);
    unmount();
    expect(mockUnsubscribe).toHaveBeenCalledTimes(1);
  });

  it('re-registers listener when trpc client changes', () => {
    const { rerender } = render(<AuthFailureHandler />);

    expect(mockOnAuthFailure).toHaveBeenCalledTimes(1);

    mockUseTRPC.mockReturnValue(createTrpcMock('v2'));
    rerender(<AuthFailureHandler />);

    expect(mockOnAuthFailure).toHaveBeenCalledTimes(2);
    expect(mockUnsubscribe).toHaveBeenCalledTimes(1);
  });
});