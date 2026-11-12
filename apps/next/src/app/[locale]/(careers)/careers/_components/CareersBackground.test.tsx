import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { CareersBackground } from './CareersBackground';

describe('CareersBackground', () => {
  it('renders structural elements', () => {
    const { container } = render(<CareersBackground />);
    expect(container.firstChild).toHaveClass('pointer-events-none');
    expect(container.querySelector('svg')).toBeInTheDocument();
    expect(container.querySelectorAll('span').length).toBeGreaterThan(0);
  });
});
