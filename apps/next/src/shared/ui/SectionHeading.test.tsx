import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { SectionHeading } from './SectionHeading';

describe('SectionHeading', () => {
  it('renders h2 by default', () => {
    render(<SectionHeading title="Hello" />);
    expect(screen.getByRole('heading', { level: 2, name: 'Hello' })).toBeInTheDocument();
  });

  it('renders h1 when isMain', () => {
    render(<SectionHeading title="Hello" isMain />);
    expect(screen.getByRole('heading', { level: 1, name: 'Hello' })).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(<SectionHeading title="Title" description="Details" />);
    expect(screen.getByText('Details')).toBeInTheDocument();
  });

  it('renders description without mx-auto when align="left"', () => {
    render(<SectionHeading title="Title" description="Desc" align="left" />);
    const desc = screen.getByText('Desc');
    expect(desc).toHaveClass('max-w-2xl');
    expect(desc).not.toHaveClass('mx-auto');
  });

  it('renders description with mx-auto when align="center"', () => {
    render(<SectionHeading title="Title" description="Desc" />);
    const desc = screen.getByText('Desc');
    expect(desc).toHaveClass('mx-auto');
    expect(desc).toHaveClass('max-w-2xl');
  });

  it('omits description when not provided', () => {
    const { container } = render(<SectionHeading title="Title" />);
    expect(container.querySelector('p')).not.toBeInTheDocument();
  });

  it('applies center alignment by default', () => {
    const { container } = render(<SectionHeading title="Title" />);
    expect(container.firstChild).toHaveClass('items-center');
    expect(container.firstChild).toHaveClass('text-center');
  });

  it('applies left alignment when align="left"', () => {
    const { container } = render(<SectionHeading title="Title" align="left" />);
    expect(container.firstChild).toHaveClass('items-start');
    expect(container.firstChild).toHaveClass('text-left');
  });

  it('uses bg-linear-to-r for gradientDirection="right"', () => {
    const { container } = render(<SectionHeading title="Title" />);
    const gradientSpan = container.querySelector('h2 span');
    expect(gradientSpan).toHaveClass('bg-linear-to-r');
  });

  it('uses bg-linear-to-l for gradientDirection="left"', () => {
    const { container } = render(<SectionHeading title="Title" gradientDirection="left" />);
    const gradientSpan = container.querySelector('h2 span');
    expect(gradientSpan).toHaveClass('bg-linear-to-l');
  });

  it('applies custom titleClassName', () => {
    render(<SectionHeading title="Title" titleClassName="my-title" />);
    expect(screen.getByRole('heading')).toHaveClass('my-title');
  });
});
