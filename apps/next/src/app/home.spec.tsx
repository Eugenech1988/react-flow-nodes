import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Home from './page';

describe('Home Page', () => {
  it('renders the instruction to edit page.tsx', () => {
    render(<Home />);

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(/To get started, edit the/i);
    expect(heading).toHaveTextContent('page.tsx');
  });

  it('contains a link to the documentation', () => {
    render(<Home />);

    const docLink = screen.getByRole('link', { name: /Documentation/i });
    expect(docLink).toBeInTheDocument();
    expect(docLink).toHaveAttribute('href', expect.stringContaining('nextjs.org/docs'));
  });

  it('contains the deploy button', () => {
    render(<Home />);

    const deployLink = screen.getByRole('link', { name: /Deploy Now/i });
    expect(deployLink).toBeInTheDocument();
  });
});
