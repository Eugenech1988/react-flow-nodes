import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Header } from './Header';

const { mockTriggerSave, mockNavigate, mockUseUser, mockSaveStatusRef } = vi.hoisted(() => ({
  mockTriggerSave: vi.fn(),
  mockNavigate: vi.fn(),
  mockUseUser: vi.fn(),
  mockSaveStatusRef: { value: 'saved' as 'saved' | 'saving' | 'unsaved' | 'error' },
}));

vi.mock('react-router-dom', () => ({
  useLocation: () => ({ pathname: '/' }),
  useNavigate: () => mockNavigate,
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
}));

vi.mock('@/features/theme-toggle', () => ({
  ThemeToggle: () => <div data-testid="theme-toggle">ThemeToggle</div>,
}));

vi.mock('@/features/user-dropdown', () => ({
  UserDropdown: () => <div data-testid="user-dropdown">UserDropdown</div>,
}));

vi.mock('@/widgets', () => ({
  ShareDialog: () => <div data-testid="share-dialog">ShareDialog</div>,
}));

vi.mock('./components/WorkflowExecutionControl', () => ({
  WorkflowExecutionControl: () => (
    <div data-testid="workflow-control">WorkflowExecutionControl</div>
  ),
}));

vi.mock('@/shared/hooks', () => ({
  useUser: () => mockUseUser(),
}));

vi.mock('@/entities', () => ({
  useStore: <T,>(
    selector: (state: {
      triggerSave: typeof mockTriggerSave;
      saveStatus: typeof mockSaveStatusRef.value;
    }) => T,
  ): T => selector({ triggerSave: mockTriggerSave, saveStatus: mockSaveStatusRef.value }),
}));

vi.mock('@/assets/logo.svg', () => ({
  default: 'test-logo.svg',
}));

type TUserRole = 'USER' | 'CONTENT_MANAGER' | 'SUPER_ADMIN';

interface IUseUserReturn {
  user: { currentPipeline: { name: string } | null } | null;
  role: TUserRole | null;
}

const createUseUserMock = (
  role: TUserRole | null = 'USER',
  pipelineName: string | null = 'Test Pipeline',
): IUseUserReturn => ({
  user: pipelineName ? { currentPipeline: { name: pipelineName } } : { currentPipeline: null },
  role,
});

const setSaveStatus = (status: 'saved' | 'saving' | 'unsaved' | 'error'): void => {
  mockSaveStatusRef.value = status;
};

describe('Header', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSaveStatusRef.value = 'saved';
    mockUseUser.mockReturnValue(createUseUserMock());
  });

  describe('logo', () => {
    it('renders logo image', () => {
      render(<Header />);

      const logo = screen.getByAltText('Pipeline logo');
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveAttribute('src', 'test-logo.svg');
    });

    it('wraps logo in link to /', () => {
      render(<Header />);

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/');
    });
  });

  describe('admin badge', () => {
    it('renders no badge for USER', () => {
      mockUseUser.mockReturnValue(createUseUserMock('USER'));

      render(<Header />);

      expect(screen.queryByText('Super Admin')).not.toBeInTheDocument();
      expect(screen.queryByText('Content Manager')).not.toBeInTheDocument();
    });

    it('renders Content Manager badge for CONTENT_MANAGER', () => {
      mockUseUser.mockReturnValue(createUseUserMock('CONTENT_MANAGER'));

      render(<Header />);

      expect(screen.getByText('Content Manager')).toBeInTheDocument();
      expect(screen.queryByText('Super Admin')).not.toBeInTheDocument();
    });

    it('renders Super Admin badge for SUPER_ADMIN', () => {
      mockUseUser.mockReturnValue(createUseUserMock('SUPER_ADMIN'));

      render(<Header />);

      expect(screen.getByText('Super Admin')).toBeInTheDocument();
      expect(screen.queryByText('Content Manager')).not.toBeInTheDocument();
    });

    it('sets descriptive title on badge', () => {
      mockUseUser.mockReturnValue(createUseUserMock('SUPER_ADMIN'));

      render(<Header />);

      const badge = screen.getByTitle('Signed in as Super Admin');
      expect(badge).toBeInTheDocument();
    });
  });

  describe('pipeline name', () => {
    it('shows pipeline name for USER with current pipeline', () => {
      mockUseUser.mockReturnValue(createUseUserMock('USER', 'My Pipeline'));

      render(<Header />);

      expect(screen.getByText('My Pipeline')).toBeInTheDocument();
    });

    it('shows pipeline name for SUPER_ADMIN with current pipeline', () => {
      mockUseUser.mockReturnValue(createUseUserMock('SUPER_ADMIN', 'Admin Pipeline'));

      render(<Header />);

      expect(screen.getByText('Admin Pipeline')).toBeInTheDocument();
    });

    it('hides pipeline name for CONTENT_MANAGER even if present', () => {
      mockUseUser.mockReturnValue(createUseUserMock('CONTENT_MANAGER', 'Hidden Pipeline'));

      render(<Header />);

      expect(screen.queryByText('Hidden Pipeline')).not.toBeInTheDocument();
    });

    it('hides pipeline name when no current pipeline', () => {
      mockUseUser.mockReturnValue(createUseUserMock('USER', null));

      render(<Header />);

      expect(screen.queryByText('Test Pipeline')).not.toBeInTheDocument();
    });
  });

  describe('save status indicator', () => {
    it('renders CloudCheck icon when saved', () => {
      setSaveStatus('saved');
      const { container } = render(<Header />);

      expect(container.querySelector('[title="Saved"]')).toBeInTheDocument();
    });

    it('renders CloudAlert icon when error', () => {
      setSaveStatus('error');
      const { container } = render(<Header />);

      expect(container.querySelector('[title="Save failed"]')).toBeInTheDocument();
    });

    it('renders Cloud icon when saving (with pulse animation)', () => {
      setSaveStatus('saving');
      const { container } = render(<Header />);

      const indicator = container.querySelector('[title="Saving…"]');
      expect(indicator).toBeInTheDocument();
      expect(indicator?.querySelector('.animate-pulse')).toBeInTheDocument();
    });

    it('renders Cloud icon when unsaved (without pulse)', () => {
      setSaveStatus('unsaved');
      const { container } = render(<Header />);

      const indicator = container.querySelector('[title="Not saved"]');
      expect(indicator).toBeInTheDocument();
      expect(indicator?.querySelector('.animate-pulse')).not.toBeInTheDocument();
    });
  });

  describe('pipeline controls visibility', () => {
    it('shows workflow control, share dialog, save and camera buttons for USER with pipeline', () => {
      mockUseUser.mockReturnValue(createUseUserMock('USER'));

      render(<Header />);

      expect(screen.getByTestId('workflow-control')).toBeInTheDocument();
      expect(screen.getByTestId('share-dialog')).toBeInTheDocument();
      expect(screen.getByTitle('Save pipeline')).toBeInTheDocument();
      expect(screen.getByTitle('Center canvas and save screenshot')).toBeInTheDocument();
    });

    it('shows pipeline controls for SUPER_ADMIN with pipeline', () => {
      mockUseUser.mockReturnValue(createUseUserMock('SUPER_ADMIN'));

      render(<Header />);

      expect(screen.getByTestId('workflow-control')).toBeInTheDocument();
      expect(screen.getByTestId('share-dialog')).toBeInTheDocument();
      expect(screen.getByTitle('Save pipeline')).toBeInTheDocument();
    });

    it('hides pipeline controls for CONTENT_MANAGER', () => {
      mockUseUser.mockReturnValue(createUseUserMock('CONTENT_MANAGER'));

      render(<Header />);

      expect(screen.queryByTestId('workflow-control')).not.toBeInTheDocument();
      expect(screen.queryByTestId('share-dialog')).not.toBeInTheDocument();
      expect(screen.queryByTitle('Save pipeline')).not.toBeInTheDocument();
      expect(screen.queryByTitle('Center canvas and save screenshot')).not.toBeInTheDocument();
    });

    it('hides pipeline controls when no current pipeline', () => {
      mockUseUser.mockReturnValue(createUseUserMock('USER', null));

      render(<Header />);

      expect(screen.queryByTestId('workflow-control')).not.toBeInTheDocument();
      expect(screen.queryByTitle('Save pipeline')).not.toBeInTheDocument();
    });
  });

  describe('save actions', () => {
    it('calls triggerSave(false, true) on save button click', () => {
      render(<Header />);

      fireEvent.click(screen.getByTitle('Save pipeline'));

      expect(mockTriggerSave).toHaveBeenCalledWith(false, true);
      expect(mockTriggerSave).toHaveBeenCalledTimes(1);
    });

    it('calls triggerSave(true, true) on camera button click', () => {
      render(<Header />);

      fireEvent.click(screen.getByTitle('Center canvas and save screenshot'));

      expect(mockTriggerSave).toHaveBeenCalledWith(true, true);
      expect(mockTriggerSave).toHaveBeenCalledTimes(1);
    });
  });

  describe('theme and user controls', () => {
    it('renders ThemeToggle', () => {
      render(<Header />);

      expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();
    });

    it('renders UserDropdown', () => {
      render(<Header />);

      expect(screen.getByTestId('user-dropdown')).toBeInTheDocument();
    });

    it('renders theme and user controls regardless of role', () => {
      mockUseUser.mockReturnValue(createUseUserMock('CONTENT_MANAGER'));

      render(<Header />);

      expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();
      expect(screen.getByTestId('user-dropdown')).toBeInTheDocument();
    });
  });
});
