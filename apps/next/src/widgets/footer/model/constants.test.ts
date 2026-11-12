import { describe, it, expect } from 'vitest';
import { getFooterColumns } from './constants';

describe('getFooterColumns', () => {
  it('returns 4 columns', () => {
    expect(getFooterColumns('en')).toHaveLength(4);
  });

  it('returns product, resources, company, legal', () => {
    const columns = getFooterColumns('en');
    expect(columns.map((c) => c.id)).toEqual(['product', 'resources', 'company', 'legal']);
  });

  it('uses locale in anchor links for product column', () => {
    const columns = getFooterColumns('ua');
    const product = columns.find((c) => c.id === 'product')!;
    expect(product.links.find((l) => l.id === 'features')?.href).toBe('/ua#features');
    expect(product.links.find((l) => l.id === 'pricing')?.href).toBe('/ua#pricing');
  });

  it('uses locale in navigation links for company column', () => {
    const columns = getFooterColumns('ua');
    const company = columns.find((c) => c.id === 'company')!;
    expect(company.links.find((l) => l.id === 'about')?.href).toBe('/ua/about');
    expect(company.links.find((l) => l.id === 'careers')?.href).toBe('/ua/careers');
  });

  it('keeps placeholder links as #', () => {
    const columns = getFooterColumns('en');
    const resources = columns.find((c) => c.id === 'resources')!;
    expect(resources.links.every((l) => l.href === '#')).toBe(true);
  });

  it('each column has 3-4 links', () => {
    const columns = getFooterColumns('en');
    for (const col of columns) {
      expect(col.links.length).toBeGreaterThanOrEqual(3);
      expect(col.links.length).toBeLessThanOrEqual(4);
    }
  });
});
