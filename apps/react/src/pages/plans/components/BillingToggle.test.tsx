import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { BillingToggle } from './BillingToggle';

interface ISwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

vi.mock('@pipeline/ui', () => ({
  Switch: ({ checked, onCheckedChange }: ISwitchProps) => (
    <button
      data-testid="switch"
      data-checked={String(checked)}
      onClick={() => onCheckedChange(!checked)}
    >
      switch
    </button>
  ),
}));

const renderToggle = (cycle: 'monthly' | 'yearly', onChange = vi.fn()) => {
  render(<BillingToggle billingCycle={cycle} onChange={onChange} />);
  return { onChange };
};

describe('BillingToggle', () => {
  describe('rendering', () => {
    it('renders Monthly and Yearly buttons', () => {
      renderToggle('monthly');
      expect(screen.getByRole('button', { name: 'Monthly' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Yearly/ })).toBeInTheDocument();
    });

    it('renders Save 20% badge inside Yearly button', () => {
      renderToggle('monthly');
      expect(screen.getByText('Save 20%')).toBeInTheDocument();
    });

    it('renders Switch', () => {
      renderToggle('monthly');
      expect(screen.getByTestId('switch')).toBeInTheDocument();
    });

    it('renders Monthly and Yearly as native buttons (keyboard accessible)', () => {
      renderToggle('monthly');
      expect(screen.getByRole('button', { name: 'Monthly' }).tagName).toBe('BUTTON');
      expect(screen.getByRole('button', { name: /Yearly/ }).tagName).toBe('BUTTON');
    });
  });

  describe('aria-pressed', () => {
    it('Monthly has aria-pressed=true when monthly', () => {
      renderToggle('monthly');
      expect(screen.getByRole('button', { name: 'Monthly' })).toHaveAttribute(
        'aria-pressed',
        'true',
      );
      expect(screen.getByRole('button', { name: /Yearly/ })).toHaveAttribute(
        'aria-pressed',
        'false',
      );
    });

    it('Yearly has aria-pressed=true when yearly', () => {
      renderToggle('yearly');
      expect(screen.getByRole('button', { name: /Yearly/ })).toHaveAttribute(
        'aria-pressed',
        'true',
      );
      expect(screen.getByRole('button', { name: 'Monthly' })).toHaveAttribute(
        'aria-pressed',
        'false',
      );
    });
  });

  describe('interactions', () => {
    it('click Monthly calls onChange("monthly")', () => {
      const { onChange } = renderToggle('yearly');
      fireEvent.click(screen.getByRole('button', { name: 'Monthly' }));
      expect(onChange).toHaveBeenCalledWith('monthly');
    });

    it('click Yearly calls onChange("yearly")', () => {
      const { onChange } = renderToggle('monthly');
      fireEvent.click(screen.getByRole('button', { name: /Yearly/ }));
      expect(onChange).toHaveBeenCalledWith('yearly');
    });

    it('Switch click from monthly → yearly calls onChange("yearly")', () => {
      const { onChange } = renderToggle('monthly');
      fireEvent.click(screen.getByTestId('switch'));
      expect(onChange).toHaveBeenCalledWith('yearly');
    });

    it('Switch click from yearly → monthly calls onChange("monthly")', () => {
      const { onChange } = renderToggle('yearly');
      fireEvent.click(screen.getByTestId('switch'));
      expect(onChange).toHaveBeenCalledWith('monthly');
    });
  });

  describe('visual state', () => {
    it('active button has foreground text, inactive has muted', () => {
      renderToggle('monthly');
      expect(screen.getByRole('button', { name: 'Monthly' }).className).toContain(
        'text-foreground',
      );
      expect(screen.getByRole('button', { name: /Yearly/ }).className).toContain(
        'text-muted-foreground',
      );
    });

    it('Yearly active shows foreground, Monthly inactive', () => {
      renderToggle('yearly');
      expect(screen.getByRole('button', { name: /Yearly/ }).className).toContain('text-foreground');
      expect(screen.getByRole('button', { name: 'Monthly' }).className).toContain(
        'text-muted-foreground',
      );
    });
  });

  describe('keyboard', () => {
    it('Enter key on Monthly triggers onChange', () => {
      const { onChange } = renderToggle('yearly');
      const btn = screen.getByRole('button', { name: 'Monthly' });
      btn.focus();
      fireEvent.keyDown(btn, { key: 'Enter' });
      fireEvent.click(btn);
      expect(onChange).toHaveBeenCalledWith('monthly');
    });

    it('Space key on Yearly triggers onChange', () => {
      const { onChange } = renderToggle('monthly');
      const btn = screen.getByRole('button', { name: /Yearly/ });
      btn.focus();
      fireEvent.keyDown(btn, { key: ' ' });
      fireEvent.click(btn);
      expect(onChange).toHaveBeenCalledWith('yearly');
    });
  });
});
