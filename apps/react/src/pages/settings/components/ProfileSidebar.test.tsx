import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProfileSidebar } from './ProfileSidebar';
import { useProfileSidebar } from '../hooks';

vi.mock('../hooks', () => ({
  useProfileSidebar: vi.fn(),
}));

vi.mock('./ProfileAvatar', () => ({
  ProfileAvatar: () => <div data-testid="profile-avatar" />,
}));

const mockedUseProfileSidebar = vi.mocked(useProfileSidebar);

type TUseProfileSidebarReturn = ReturnType<typeof useProfileSidebar>;

const createHookMock = (
  overrides: Partial<TUseProfileSidebarReturn> = {},
): TUseProfileSidebarReturn => ({
  displayName: 'Jane Doe',
  jobTitle: '',
  initials: 'JD',
  avatarUrl: null,
  isTwoFactorEnabled: false,
  isProActive: false,
  planLabel: 'Free Plan',
  ...overrides,
});

describe('ProfileSidebar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders Free Plan label for a non-Pro user', () => {
    mockedUseProfileSidebar.mockReturnValue(createHookMock());

    render(<ProfileSidebar />);

    expect(screen.getByText('Free Plan')).toBeInTheDocument();
    expect(screen.queryByText('Pro Plan')).not.toBeInTheDocument();
  });

  it('renders Pro Plan label for a Pro user', () => {
    mockedUseProfileSidebar.mockReturnValue(
      createHookMock({ isProActive: true, planLabel: 'Pro Plan' }),
    );

    render(<ProfileSidebar />);

    expect(screen.getByText('Pro Plan')).toBeInTheDocument();
    expect(screen.queryByText('Free Plan')).not.toBeInTheDocument();
  });

  it('renders two-factor enabled state', () => {
    mockedUseProfileSidebar.mockReturnValue(createHookMock({ isTwoFactorEnabled: true }));

    render(<ProfileSidebar />);

    expect(screen.getByText('Enabled')).toBeInTheDocument();
    expect(screen.queryByText('Disabled')).not.toBeInTheDocument();
  });

  it('renders two-factor disabled state', () => {
    mockedUseProfileSidebar.mockReturnValue(createHookMock({ isTwoFactorEnabled: false }));

    render(<ProfileSidebar />);

    expect(screen.getByText('Disabled')).toBeInTheDocument();
    expect(screen.queryByText('Enabled')).not.toBeInTheDocument();
  });

  it('renders display name and job title', () => {
    mockedUseProfileSidebar.mockReturnValue(
      createHookMock({ displayName: 'John Smith', jobTitle: 'Engineer' }),
    );

    render(<ProfileSidebar />);

    expect(screen.getByText('John Smith')).toBeInTheDocument();
    expect(screen.getByText('Engineer')).toBeInTheDocument();
  });

  it('hides job title when empty', () => {
    mockedUseProfileSidebar.mockReturnValue(createHookMock({ jobTitle: '' }));

    const { container } = render(<ProfileSidebar />);

    expect(container.querySelectorAll('p').length).toBe(0);
  });

  it('always renders avatar', () => {
    mockedUseProfileSidebar.mockReturnValue(createHookMock());

    render(<ProfileSidebar />);

    expect(screen.getByTestId('profile-avatar')).toBeInTheDocument();
  });
});
