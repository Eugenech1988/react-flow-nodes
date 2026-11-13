import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';

import { BlogBackground } from './BlogBackground';

describe('BlogBackground', () => {
  it('renders structural elements', () => {
    const { container } = render(<BlogBackground />);
    expect(container.firstChild).toHaveClass('pointer-events-none');
    expect(container.querySelectorAll('span').length).toBeGreaterThan(0);
  });
});
