import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UserDropdown } from './UserDropdown';

const { mockLogout, mockUseUser } = vi.hoisted(() => ({
  mockLogout: vi.fn(),
  mockUseUser: vi.fn(),
}));

vi.mock('@/shared/hooks', () => ({
  useUser: () => mockUseUser(),
  useLogout: () => ({ logout: mockLogout }),
}));

vi.mock('@pipeline/ui', () => ({
  DropdownMenu: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuItem: ({ children, ...props }: unknown) => <button {...props}>{children}</button>,
  DropdownMenuLabel: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuSeparator: () => <hr />,
  DropdownMenuGroup: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('react-router-dom', () => ({
  Link: ({ children, to }: unknown) => <a href={to}>{children}</a>,
}));

const createUser =   (overrides: Record<string, unknown> = {}) => ({
  user: {
    email: 'test@example.com',
    subscription: { plan: 'PRO' },
    profile: { firstName: 'John', lastName: 'Doe', avatarUrl: null },
    ...overrides,
  },
  role: 'USER',
});

describe('UserDropdown', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders initials from first and last name', () => {
    mockUseUser.mockReturnValue(createUser());
    render(<UserDropdown />);
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('renders initials from first name only', () => {
    mockUseUser.mockReturnValue(createUser({ profile: { firstName: 'John', lastName: '', avatarUrl: null } }));
    render(<UserDropdown />);
    expect(screen.getByText('JO')).toBeInTheDocument();
  });

  it('renders initials from email when no name', () => {
    mockUseUser.mockReturnValue(createUser({ profile: null }));
    render(<UserDropdown />);
    expect(screen.getByText('TE')).toBeInTheDocument();
  });

  it('renders full name', () => {
    mockUseUser.mockReturnValue(createUser());
    render(<UserDropdown />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('renders nickname if no first/last name', () => {
    mockUseUser.mockReturnValue(createUser({ profile: { nickName: 'johnny', avatarUrl: null } }));
    render(<UserDropdown />);
    expect(screen.getByText('johnny')).toBeInTheDocument();
  });

  it('renders avatar image if avatarUrl present', () => {
    mockUseUser.mockReturnValue(createUser({ profile: { avatarUrl: 'http://img.com/a.jpg' } }));
    render(<UserDropdown />);
    expect(screen.getByRole('img')).toHaveAttribute('src', 'http://img.com/a.jpg');
  });

  it('prefixes relative avatar url with BASE_URL', () => {
    mockUseUser.mockReturnValue(createUser({ profile: { avatarUrl: '/uploads/a.jpg' } }));
    render(<UserDropdown />);
    expect(screen.getByRole('img').getAttribute('src')).toMatch(/\/uploads\/a\.jpg$/);
  });

  it('hides billing for CONTENT_MANAGER', () => {
    mockUseUser.mockReturnValue({ ...createUser(), role: 'CONTENT_MANAGER' });
    render(<UserDropdown />);
    expect(screen.queryByText('Billing')).not.toBeInTheDocument();
  });

  it('shows billing for USER', () => {
    mockUseUser.mockReturnValue(createUser());
    render(<UserDropdown />);
    expect(screen.getByText('Billing')).toBeInTheDocument();
  });

  it('shows upgrade button for FREE plan', () => {
    mockUseUser.mockReturnValue(createUser({ subscription: { plan: 'FREE' } }));
    render(<UserDropdown />);
    expect(screen.getByText('Activate Pro Plan')).toBeInTheDocument();
  });

  it('calls logout on Log out click', () => {
    mockUseUser.mockReturnValue(createUser());
    render(<UserDropdown />);
    fireEvent.click(screen.getByText('Log out'));
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
});
