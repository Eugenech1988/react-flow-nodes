import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';

const pushMock = vi.fn();
const changeLanguageMock = vi.fn();

let mockI18n: { language: string; changeLanguage?: typeof changeLanguageMock } | undefined = {
  language: 'en',
  changeLanguage: changeLanguageMock,
};

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
}));

vi.mock('@/shared/lib/i18n/client', () => ({
  useT: () => ({ i18n: mockI18n }),
}));

import { LanguageSwitcher } from './LanguageSwitcher';

describe('LanguageSwitcher', () => {
  beforeEach(() => {
    pushMock.mockReset();
    changeLanguageMock.mockReset();
    mockI18n = { language: 'en', changeLanguage: changeLanguageMock };
    window.history.pushState({}, '', '/en/some-page');
  });

  it('renders EN and UA buttons', () => {
    render(<LanguageSwitcher />);
    expect(screen.getByRole('button', { name: 'EN' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'UA' })).toBeInTheDocument();
  });

  it('marks EN active when locale is en', () => {
    render(<LanguageSwitcher locale="en" />);
    expect(screen.getByRole('button', { name: 'EN' })).toHaveClass('font-bold');
  });

  it('marks UA active when locale is uk', () => {
    render(<LanguageSwitcher locale="uk" />);
    expect(screen.getByRole('button', { name: 'UA' })).toHaveClass('font-bold');
  });

  it('does not push when clicking current locale', async () => {
    render(<LanguageSwitcher locale="en" />);
    await userEvent.click(screen.getByRole('button', { name: 'EN' }));
    expect(pushMock).not.toHaveBeenCalled();
  });

  it('does not push when clicking UA on uk locale', async () => {
    render(<LanguageSwitcher locale="uk" />);
    await userEvent.click(screen.getByRole('button', { name: 'UA' }));
    expect(pushMock).not.toHaveBeenCalled();
  });

  it('switches locale in path on UA click', async () => {
    render(<LanguageSwitcher locale="en" />);
    await userEvent.click(screen.getByRole('button', { name: 'UA' }));
    expect(changeLanguageMock).toHaveBeenCalledWith('uk');
    expect(pushMock).toHaveBeenCalledWith('/uk/some-page', { scroll: false });
  });

  it('prepends locale when not in path', async () => {
    window.history.pushState({}, '', '/some-page');
    render(<LanguageSwitcher locale="en" />);
    await userEvent.click(screen.getByRole('button', { name: 'UA' }));
    expect(pushMock).toHaveBeenCalledWith('/uk/some-page', { scroll: false });
  });

  it('handles path without locale', async () => {
    window.history.pushState({}, '', '/');
    render(<LanguageSwitcher locale="en" />);
    await userEvent.click(screen.getByRole('button', { name: 'UA' }));
    expect(pushMock).toHaveBeenCalledWith('/uk/', { scroll: false });
  });

  it('does not throw when i18n itself is undefined', async () => {
    mockI18n = undefined;
    render(<LanguageSwitcher locale="en" />);
    await userEvent.click(screen.getByRole('button', { name: 'UA' }));
    expect(pushMock).toHaveBeenCalledWith('/uk/some-page', { scroll: false });
  });

  it('does not throw when i18n.changeLanguage is missing', async () => {
    mockI18n = { language: 'en' };
    render(<LanguageSwitcher locale="en" />);
    await userEvent.click(screen.getByRole('button', { name: 'UA' }));
    expect(pushMock).toHaveBeenCalledWith('/uk/some-page', { scroll: false });
  });

  it('handles missing i18n and missing locale gracefully', async () => {
    mockI18n = undefined;
    render(<LanguageSwitcher />);
    await userEvent.click(screen.getByRole('button', { name: 'UA' }));
    expect(pushMock).toHaveBeenCalledWith('/uk/some-page', { scroll: false });
  });

  it('falls back to / when join result is empty', async () => {
    window.history.pushState({}, '', '/en/some-page');
    const realJoin = Array.prototype.join;
    vi.spyOn(Array.prototype, 'join').mockImplementation(function (
      this: unknown[],
      sep?: string,
    ) {
      if (sep === '/' && Array.isArray(this) && this.length === 3 && this[1] === 'uk') {
        return '';
      }
      return realJoin.call(this, sep);
    });
    render(<LanguageSwitcher locale="en" />);
    await userEvent.click(screen.getByRole('button', { name: 'UA' }));
    expect(pushMock).toHaveBeenCalledWith('/', { scroll: false });
    vi.mocked(Array.prototype.join).mockRestore();
  });

  it('applies w-full when isMobile', () => {
    const { container } = render(<LanguageSwitcher locale="en" isMobile />);
    expect(container.firstChild).toHaveClass('w-full');
  });

  it('uses rounded-sm for careers theme', () => {
    const { container } = render(<LanguageSwitcher locale="en" theme="careers" />);
    expect(container.firstChild).toHaveClass('rounded-sm');
  });

  it('uses rounded-sm for blog theme', () => {
    const { container } = render(<LanguageSwitcher locale="en" theme="blog" />);
    expect(container.firstChild).toHaveClass('rounded-sm');
  });

  it('falls back to i18n.language when locale is missing', () => {
    render(<LanguageSwitcher />);
    expect(screen.getByRole('button', { name: 'EN' })).toHaveClass('font-bold');
  });

  it('falls back to en when i18n.language is missing', () => {
    mockI18n = { language: '' };
    render(<LanguageSwitcher />);
    expect(screen.getByRole('button', { name: 'EN' })).toHaveClass('font-bold');
  });

  it('uses rounded-xl for default theme', () => {
    const { container } = render(<LanguageSwitcher locale="en" />);
    expect(container.firstChild).toHaveClass('rounded-xl');
  });
});
