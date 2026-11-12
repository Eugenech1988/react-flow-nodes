import { describe, it, expect } from 'vitest';
import { themeScope } from './theme';

describe('themeScope', () => {
  it('returns undefined when theme is omitted', () => {
    expect(themeScope()).toBeUndefined();
    expect(themeScope(undefined)).toBeUndefined();
  });

  it.each(['default', 'careers', 'blog'] as const)(
    'returns { "data-theme": "%s" } for explicit theme',
    (theme) => {
      expect(themeScope(theme)).toEqual({ 'data-theme': theme });
    },
  );
});