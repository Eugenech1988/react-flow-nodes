import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import {
  SocialLinks,
  SOCIAL_NODES,
  GithubIcon,
  LinkedinIcon,
  XTwitterIcon,
  TelegramIcon,
  FacebookIcon,
} from './SocialLinks';

vi.mock('@/shared/lib/i18n/client', () => ({
  useT: () => ({
    t: (key: string, opts?: { defaultValue?: string }) => opts?.defaultValue ?? key,
  }),
}));

describe('SocialLinks', () => {
  it('renders exactly 3 social links', () => {
    render(<SocialLinks />);
    expect(screen.getAllByRole('link')).toHaveLength(3);
  });

  it.each(SOCIAL_NODES.map((n) => [n.id, n.href]))(
    'renders link "%s" with href "%s"',
    (_id, href) => {
      render(<SocialLinks />);
      const links = screen.getAllByRole('link');
      expect(links.some((l) => l.getAttribute('href') === href)).toBe(true);
    },
  );

  it('opens links in new tab with noopener noreferrer', () => {
    render(<SocialLinks />);
    for (const link of screen.getAllByRole('link')) {
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    }
  });

  it('renders title when provided', () => {
    render(<SocialLinks title="Follow us" />);
    expect(screen.getByText('Follow us')).toBeInTheDocument();
  });

  it('does not render title when omitted', () => {
    const { container } = render(<SocialLinks />);
    expect(container.querySelector('.mb-4')).not.toBeInTheDocument();
  });

  it('left-aligns title by default', () => {
    render(<SocialLinks title="T" />);
    const title = screen.getByText('T');
    expect(title).not.toHaveClass('text-center');
    expect(title).not.toHaveClass('text-right');
  });

  it('centers title when align="center"', () => {
    render(<SocialLinks title="T" align="center" />);
    expect(screen.getByText('T')).toHaveClass('text-center');
  });

  it('right-aligns title when align="end"', () => {
    render(<SocialLinks title="T" align="end" />);
    expect(screen.getByText('T')).toHaveClass('text-right');
  });

  it('centers links row when align="center"', () => {
    const { container } = render(<SocialLinks align="center" />);
    expect(container.querySelector('.flex.items-center.gap-3')).toHaveClass('justify-center');
  });

  it('right-aligns links row when align="end"', () => {
    const { container } = render(<SocialLinks align="end" />);
    expect(container.querySelector('.flex.items-center.gap-3')).toHaveClass('justify-end');
  });

  it('sets data-theme when theme is passed', () => {
    const { container } = render(<SocialLinks theme="careers" />);
    expect(container.firstChild).toHaveAttribute('data-theme', 'careers');
  });

  it('does not set data-theme when theme is omitted', () => {
    const { container } = render(<SocialLinks />);
    expect(container.firstChild).not.toHaveAttribute('data-theme');
  });

  it('renders small size when size="sm"', () => {
    render(<SocialLinks size="sm" />);
    expect(screen.getAllByRole('link')[0]).toHaveClass('h-9');
  });
});

describe('icon components', () => {
  it.each([
    ['GithubIcon', GithubIcon],
    ['LinkedinIcon', LinkedinIcon],
    ['XTwitterIcon', XTwitterIcon],
    ['TelegramIcon', TelegramIcon],
    ['FacebookIcon', FacebookIcon],
  ] as const)('renders %s standalone', (name, Icon) => {
    const { container } = render(<Icon data-testid={`icon-${name}`} />);
    expect(container.querySelector(`[data-testid="icon-${name}"]`)).toBeInTheDocument();
  });

  it('forwards custom className to icon', () => {
    const { container } = render(<TelegramIcon className="custom-icon" />);
    expect(container.querySelector('svg.custom-icon')).toBeInTheDocument();
  });
});
