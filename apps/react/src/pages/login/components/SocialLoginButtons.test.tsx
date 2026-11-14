import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SocialLoginButtons } from './SocialLoginButtons';

vi.mock('@pipeline/ui', () => ({
  Button: ({ children, onClick }: unknown) => (
    <button onClick={onClick} data-testid="social-btn">
      {children}
    </button>
  ),
}));

describe('SocialLoginButtons', () => {
  it('renders Google and GitHub buttons', () => {
    render(<SocialLoginButtons onGoogleClick={vi.fn()} onGithubClick={vi.fn()} />);
    expect(screen.getByText('Google')).toBeInTheDocument();
    expect(screen.getByText('GitHub')).toBeInTheDocument();
  });

  it('triggers onGoogleClick', () => {
    const onGoogleClick = vi.fn();
    render(<SocialLoginButtons onGoogleClick={onGoogleClick} onGithubClick={vi.fn()} />);
    fireEvent.click(screen.getAllByTestId('social-btn')[0]);
    expect(onGoogleClick).toHaveBeenCalled();
  });

  it('triggers onGithubClick', () => {
    const onGithubClick = vi.fn();
    render(<SocialLoginButtons onGoogleClick={vi.fn()} onGithubClick={onGithubClick} />);
    fireEvent.click(screen.getAllByTestId('social-btn')[1]);
    expect(onGithubClick).toHaveBeenCalled();
  });
});
