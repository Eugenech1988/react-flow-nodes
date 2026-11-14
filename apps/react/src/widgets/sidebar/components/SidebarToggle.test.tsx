import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { SidebarToggle } from './SidebarToggle';
import { useSidebarStore } from '../model';

describe('SidebarToggle', () => {
  beforeEach(() => {
    useSidebarStore.setState({ isOpen: false });
  });

  it('renders a button with aria-label', () => {
    render(<SidebarToggle />);
    expect(screen.getByRole('button', { name: /toggle sidebar/i })).toBeInTheDocument();
  });

  it('toggles store on click', () => {
    render(<SidebarToggle />);
    fireEvent.click(screen.getByRole('button', { name: /toggle sidebar/i }));
    expect(useSidebarStore.getState().isOpen).toBe(true);

    fireEvent.click(screen.getByRole('button', { name: /toggle sidebar/i }));
    expect(useSidebarStore.getState().isOpen).toBe(false);
  });

  it('renders both panel icons', () => {
    const { container } = render(<SidebarToggle />);
    expect(container.querySelector('.lucide-panel-left-close')).toBeInTheDocument();
    expect(container.querySelector('.lucide-panel-left-open')).toBeInTheDocument();
  });
});
