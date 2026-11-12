import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { Cog } from 'lucide-react';
import { PaperCard } from './PaperCard';
import { TornPaperCard } from './TornPaperCard';
import { StickyNoteCard } from './StickyNoteCard';
import { ChamferedCard } from './ChamferedCard';

describe('PaperCard', () => {
  it('renders children', () => {
    render(<PaperCard>content</PaperCard>);
    expect(screen.getByText('content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<PaperCard className="custom">x</PaperCard>);
    expect(container.firstChild).toHaveClass('custom');
  });

  it('applies clipPath style', () => {
    const { container } = render(<PaperCard clipPath="polygon(0 0, 100% 100%)">x</PaperCard>);
    expect(container.firstChild).toHaveStyle({ clipPath: 'polygon(0 0, 100% 100%)' });
  });

  it('renders decor', () => {
    render(<PaperCard decor={<span data-testid="decor" />}>x</PaperCard>);
    expect(screen.getByTestId('decor')).toBeInTheDocument();
  });
});

describe('TornPaperCard', () => {
  const props = {
    title: 'Remote-first',
    description: 'Work from anywhere',
    number: '01',
    Icon: Cog,
    badge: 'PERK',
  };

  it('renders title', () => {
    render(<TornPaperCard {...props} />);
    expect(screen.getByText('Remote-first')).toBeInTheDocument();
  });

  it('renders description', () => {
    render(<TornPaperCard {...props} />);
    expect(screen.getByText('Work from anywhere')).toBeInTheDocument();
  });

  it('renders number', () => {
    render(<TornPaperCard {...props} />);
    expect(screen.getByText('01')).toBeInTheDocument();
  });

  it('renders badge', () => {
    render(<TornPaperCard {...props} />);
    expect(screen.getByText('PERK')).toBeInTheDocument();
  });
});

describe('StickyNoteCard', () => {
  const props = { title: 'Apply', description: 'Send your CV', number: '01' };

  it('renders title', () => {
    render(<StickyNoteCard {...props} />);
    expect(screen.getByText('Apply')).toBeInTheDocument();
  });

  it('renders description', () => {
    render(<StickyNoteCard {...props} />);
    expect(screen.getByText('Send your CV')).toBeInTheDocument();
  });

  it('renders number with dot', () => {
    render(<StickyNoteCard {...props} />);
    expect(screen.getByText('01.')).toBeInTheDocument();
  });
});

describe('ChamferedCard', () => {
  it('renders children', () => {
    render(<ChamferedCard>42</ChamferedCard>);
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<ChamferedCard className="custom">x</ChamferedCard>);
    expect(container.firstChild).toHaveClass('custom');
  });

  it('applies clip-path to inner layers', () => {
    const { container } = render(<ChamferedCard>x</ChamferedCard>);
    expect(container.querySelector('[style*="polygon"]')).toBeInTheDocument();
  });
});
