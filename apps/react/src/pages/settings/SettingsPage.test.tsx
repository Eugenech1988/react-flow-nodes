import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SettingsPage } from './SettingsPage';

const { mockNavigate, mockUseLocation, mockUseUser } = vi.hoisted(() => ({
  mockNavigate: vi.fn(),
  mockUseLocation: vi.fn(),
  mockUseUser: vi.fn(),
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => mockUseLocation(),
  Outlet: () => <div data-testid="outlet" />,
}));

vi.mock('@/shared/hooks', () => ({
  useUser: () => mockUseUser(),
}));

vi.mock('@/shared/ui', () => ({
  Tabs: ({ currentTab, onTabChange }: unknown) => (
    <button data-testid="tabs" onClick={() => onTabChange('account')}>
      {currentTab}
    </button>
  ),
}));

vi.mock('./components', () => ({
  ProfileSidebar: () => <div data-testid="profile-sidebar" />,
}));

vi.mock('@/shared/lib', () => ({
  PAGE_VARIANTS: {},
  SETTINGS_CONTENT_VARIANTS: {},
}));

vi.mock('framer-motion', () => ({
  motion: { div: ({ children }: { children: React.ReactNode }) => <div>{children}</div> },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('./model', () => ({
  SETTINGS_TABS: vi.fn(() => []),
}));

describe('SettingsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseUser.mockReturnValue({ isProActive: false, role: 'USER' });
    mockUseLocation.mockReturnValue({ pathname: '/settings/profile' });
  });

  it('renders title and layout', () => {
    render(<SettingsPage />);
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByTestId('profile-sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('outlet')).toBeInTheDocument();
  });

  it('navigates on tab change', () => {
    render(<SettingsPage />);
    fireEvent.click(screen.getByTestId('tabs'));
    expect(mockNavigate).toHaveBeenCalledWith('/settings/account');
  });

  it('redirects CM from billing', () => {
    mockUseUser.mockReturnValue({ isProActive: false, role: 'CONTENT_MANAGER' });
    mockUseLocation.mockReturnValue({ pathname: '/settings/billing' });
    render(<SettingsPage />);
    expect(mockNavigate).toHaveBeenCalledWith('/settings/profile', { replace: true });
  });

  it('falls back to profile tab for empty path', () => {
    mockUseLocation.mockReturnValue({ pathname: '/settings/' });
    render(<SettingsPage />);
    expect(screen.getByTestId('tabs')).toHaveTextContent('profile');
  });
});
