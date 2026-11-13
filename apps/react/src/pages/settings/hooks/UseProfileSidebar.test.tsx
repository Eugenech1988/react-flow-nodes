import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useProfileSidebar } from './useProfileSidebar';
import { useUser } from '@/shared/hooks';

vi.mock('@/shared/hooks', () => ({
  useUser: vi.fn(),
}));

const mockedUseUser = vi.mocked(useUser);

type TUseUserReturn = ReturnType<typeof useUser>;
type TUserShape = NonNullable<TUseUserReturn['user']>;

const createUserShape = (overrides: Record<string, unknown> = {}): TUserShape =>
  ({
    id: 'u1',
    email: 'user@example.com',
    provider: 'local',
    providerId: 'provider-1',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    isTwoFactorEnabled: false,
    profile: null,
    subscription: null,
    ...overrides,
  }) as unknown as TUserShape;

const createUseUserMock = (overrides: Partial<TUseUserReturn> = {}): TUseUserReturn => ({
  user: null,
  isAuth: false,
  role: null,
  isProActive: false,
  isLoading: false,
  isError: false,
  error: null,
  ...overrides,
});

describe('useProfileSidebar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns Free Plan label when user is not Pro', () => {
    mockedUseUser.mockReturnValue(createUseUserMock());

    const { result } = renderHook(() => useProfileSidebar());

    expect(result.current.isProActive).toBe(false);
    expect(result.current.planLabel).toBe('Free Plan');
  });

  it('returns Pro Plan label when user is Pro', () => {
    mockedUseUser.mockReturnValue(createUseUserMock({ isProActive: true }));

    const { result } = renderHook(() => useProfileSidebar());

    expect(result.current.isProActive).toBe(true);
    expect(result.current.planLabel).toBe('Pro Plan');
  });

  it('builds display name from first and last name', () => {
    mockedUseUser.mockReturnValue(
      createUseUserMock({
        user: createUserShape({
          profile: {
            id: 'pr1',
            userId: 'u1',
            nickName: 'jd',
            firstName: 'Jane',
            lastName: 'Doe',
            avatarUrl: null,
            company: null,
            location: null,
            jobTitle: null,
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z',
          },
        }),
      }),
    );

    const { result } = renderHook(() => useProfileSidebar());

    expect(result.current.displayName).toBe('Jane Doe');
    expect(result.current.initials).toBe('JD');
  });

  it('falls back to nickname for display name when names are missing', () => {
    mockedUseUser.mockReturnValue(
      createUseUserMock({
        user: createUserShape({
          email: 'john@example.com',
          profile: {
            id: 'pr1',
            userId: 'u1',
            nickName: 'johnny',
            firstName: '',
            lastName: '',
            avatarUrl: null,
            company: null,
            location: null,
            jobTitle: null,
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z',
          },
        }),
      }),
    );

    const { result } = renderHook(() => useProfileSidebar());

    expect(result.current.displayName).toBe('johnny');
    expect(result.current.initials).toBe('JO');
  });

  it('returns absolute avatar url when value already has a scheme', () => {
    mockedUseUser.mockReturnValue(
      createUseUserMock({
        user: createUserShape({
          profile: {
            id: 'pr1',
            userId: 'u1',
            nickName: 'ab',
            firstName: 'A',
            lastName: 'B',
            avatarUrl: 'https://cdn.example.com/a.png',
            company: null,
            location: null,
            jobTitle: null,
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z',
          },
        }),
      }),
    );

    const { result } = renderHook(() => useProfileSidebar());

    expect(result.current.avatarUrl).toBe('https://cdn.example.com/a.png');
  });

  it('prefixes relative avatar url with API base', () => {
    mockedUseUser.mockReturnValue(
      createUseUserMock({
        user: createUserShape({
          profile: {
            id: 'pr1',
            userId: 'u1',
            nickName: 'ab',
            firstName: 'A',
            lastName: 'B',
            avatarUrl: '/uploads/avatar.png',
            company: null,
            location: null,
            jobTitle: null,
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z',
          },
        }),
      }),
    );

    const { result } = renderHook(() => useProfileSidebar());

    expect(result.current.avatarUrl).toMatch(/\/uploads\/avatar\.png$/);
  });

  it('returns default fallbacks when user is null', () => {
    mockedUseUser.mockReturnValue(createUseUserMock());

    const { result } = renderHook(() => useProfileSidebar());

    expect(result.current.displayName).toBe('User');
    expect(result.current.initials).toBe('U');
    expect(result.current.avatarUrl).toBeNull();
    expect(result.current.isTwoFactorEnabled).toBe(false);
  });

  it('exposes two-factor flag from user', () => {
    mockedUseUser.mockReturnValue(
      createUseUserMock({
        user: createUserShape({ isTwoFactorEnabled: true }),
      }),
    );

    const { result } = renderHook(() => useProfileSidebar());

    expect(result.current.isTwoFactorEnabled).toBe(true);
  });
});