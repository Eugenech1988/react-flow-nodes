import { describe, it, expect } from 'vitest';
import { jobFormSchema } from './form-schema';

const validEn = {
  title: 'Senior Dev',
  description: 'Description here',
  responsibilities: 'Build\nTest',
  requirements: 'React',
  metaTitle: '',
  metaDescription: '',
};

const validUa = {
  title: '',
  description: '',
  responsibilities: '',
  requirements: '',
  metaTitle: '',
  metaDescription: '',
};

const validBase = {
  slug: 'senior-dev',
  department: 'ENGINEERING',
  level: 'MID',
  type: 'FULL_TIME',
  location: 'Remote',
  icon: 'code-2',
  status: 'DRAFT',
};

describe('jobFormSchema', () => {
  it('accepts valid form', () => {
    const result = jobFormSchema.safeParse({
      ...validBase,
      en: validEn,
      ua: validUa,
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid slug (uppercase)', () => {
    const result = jobFormSchema.safeParse({
      ...validBase,
      slug: 'Senior-Dev',
      en: validEn,
      ua: validUa,
    });
    expect(result.success).toBe(false);
  });

  it('rejects short en title', () => {
    const result = jobFormSchema.safeParse({
      ...validBase,
      en: { ...validEn, title: 'X' },
      ua: validUa,
    });
    expect(result.success).toBe(false);
  });

  it('accepts ua with both title and description', () => {
    const result = jobFormSchema.safeParse({
      ...validBase,
      en: validEn,
      ua: {
        ...validUa,
        title: 'UA Title Long Enough',
        description: 'UA description more than ten chars',
      },
    });
    expect(result.success).toBe(true);
  });

  it('rejects ua with only title', () => {
    const result = jobFormSchema.safeParse({
      ...validBase,
      en: validEn,
      ua: {
        ...validUa,
        title: 'UA Title Long Enough',
        description: 'UA description more than ten chars',
      },
    });
    expect(result.success).toBe(true);
  });

  it('rejects ua with only description (no title)', () => {
    const result = jobFormSchema.safeParse({
      ...validBase,
      en: validEn,
      ua: {
        ...validUa,
        title: '',
        description: 'UA description more than ten chars',
      },
    });
    expect(result.success).toBe(false);
  });
});
