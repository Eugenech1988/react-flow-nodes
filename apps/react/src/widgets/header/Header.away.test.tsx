import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Header } from './Header';

const { mockTriggerSave, mockUseUser } = vi.hoisted(() => ({
  mockTriggerSave: vi.fn(),
  mockUseUser: vi.fn(),
}));

vi.mock('react-router-dom', () => ({
  useLocation: () => ({ pathname: '/pipelines' }),
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
}));

vi.mock('@/features/theme-toggle', () => ({
  ThemeToggle: () => <div data-testid="theme-toggle" />,
}));

vi.mock('@/features/user-dropdown', () => ({
  UserDropdown: () => <div data-testid="user-dropdown" />,
}));

vi.mock('@/widgets', () => ({
  ShareDialog: () => <div data-testid="share-dialog" />,
}));

vi.mock('./components/WorkflowExecutionControl', () => ({
  WorkflowExecutionControl: () => <div data-testid="workflow-control" />,
}));

vi.mock('@/shared/hooks', () => ({
  useUser: () => mockUseUser(),
}));

vi.mock('@/entities', () => ({
  useStore: <T,>(
    selector: (state: { triggerSave: typeof mockTriggerSave; saveStatus: 'saved' }) => T,
  ): T => selector({ triggerSave: mockTriggerSave, saveStatus: 'saved' }),
}));

vi.mock('@/assets/logo.svg', () => ({
  default: 'test-logo.svg',
}));

describe('Header — away from home', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseUser.mockReturnValue({
      user: { currentPipeline: { name: 'Test Pipeline' } },
      role: 'USER',
    });
  });

  it('renders both save and camera buttons disabled with informative title', () => {
    render(<Header />);

    const disabledButtons = screen.getAllByTitle('Saving is only available on the canvas page');

    expect(disabledButtons).toHaveLength(2);
    disabledButtons.forEach((btn) => expect(btn).toBeDisabled());
  });

  it('renders save icon and camera icon', () => {
    const { container } = render(<Header />);

    expect(container.querySelector('.lucide-save')).toBeInTheDocument();
    expect(container.querySelector('.lucide-camera')).toBeInTheDocument();
  });

  it('does not call triggerSave when disabled save button is clicked', () => {
    render(<Header />);

    const [saveButton] = screen.getAllByTitle('Saving is only available on the canvas page');
    saveButton.click();

    expect(mockTriggerSave).not.toHaveBeenCalled();
  });

  it('does not call triggerSave when disabled camera button is clicked', () => {
    render(<Header />);

    const [, cameraButton] = screen.getAllByTitle('Saving is only available on the canvas page');
    cameraButton.click();

    expect(mockTriggerSave).not.toHaveBeenCalled();
  });

  it('still renders workflow and share controls', () => {
    render(<Header />);

    expect(screen.getByTestId('workflow-control')).toBeInTheDocument();
    expect(screen.getByTestId('share-dialog')).toBeInTheDocument();
  });

  it('renders theme and user controls', () => {
    render(<Header />);

    expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();
    expect(screen.getByTestId('user-dropdown')).toBeInTheDocument();
  });
});
