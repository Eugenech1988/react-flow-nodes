import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { TechLabel } from './TechLabel';

describe('TechLabel', () => {
  it('renders children', () => {
    render(<TechLabel>Test Label</TechLabel>);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<TechLabel className="custom-class">Test</TechLabel>);
    expect(screen.getByText('Test')).toHaveClass('custom-class');
  });
});
