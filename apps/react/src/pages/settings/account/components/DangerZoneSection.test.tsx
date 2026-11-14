import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DangerZoneSection } from './DangerZoneSection';
import { useDangerZoneSection } from '../hooks';

vi.mock('../hooks', () => ({
  useDangerZoneSection: vi.fn(),
}));

vi.mock('./DeleteAccountModal', () => ({
  DeleteAccountModal: ({ isOpen, onConfirm }: unknown) =>
    isOpen ? <button onClick={onConfirm}>ConfirmDelete</button> : null,
}));

vi.mock('@/shared/ui', () => ({
  AppButton: ({ text, onClick }: unknown) => <button onClick={onClick}>{text}</button>,
  LocalAlert: ({ alertMessage }: unknown) => <div>{alertMessage}</div>,
}));

const mockedUseDangerZone = vi.mocked(useDangerZoneSection);

const createHookMock =   (overrides: Record<string, unknown> = {}) => ({
  isOpen: false,
  isPending: false,
  alert: null,
  open: vi.fn(),
  close: vi.fn(),
  confirm: vi.fn(),
  ...overrides,
});

describe('DangerZoneSection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly', () => {
    mockedUseDangerZone.mockReturnValue(createHookMock());
    render(<DangerZoneSection />);
    expect(screen.getByText('Danger Zone')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Delete Account' }),
    ).toBeInTheDocument();
  });

  it('opens modal', () => {
    const open = vi.fn();
    mockedUseDangerZone.mockReturnValue(createHookMock({ open }));
    render(<DangerZoneSection />);
    fireEvent.click(screen.getByRole('button', { name: 'Delete Account' }));
    expect(open).toHaveBeenCalled();
  });

  it('renders modal when open and confirms', () => {
    const confirm = vi.fn();
    mockedUseDangerZone.mockReturnValue(createHookMock({ isOpen: true, confirm }));
    render(<DangerZoneSection />);
    fireEvent.click(screen.getByText('ConfirmDelete'));
    expect(confirm).toHaveBeenCalled();
  });

  it('renders alert', () => {
    mockedUseDangerZone.mockReturnValue(
      createHookMock({ alert: { type: 'error', message: 'Failed to delete' } }),
    );
    render(<DangerZoneSection />);
    expect(screen.getByText('Failed to delete')).toBeInTheDocument();
  });
});
