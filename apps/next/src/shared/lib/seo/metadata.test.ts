import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.hoisted(() => {
  process.env.NEXT_PUBLIC_SITE_URL = 'https://pipelinestudios.com';
  delete process.env.BASE_URL;
});

vi.mock('@/shared/lib/i18n/server', () => ({
  getT: vi.fn(),
}));

vi.mock('next/cache', () => ({
  cacheLife: vi.fn(),
}));

import { SITE_NAME, SITE_URL, buildMetadata, getPageMetadata, getRootMetadata } from './metadata';
import { getT } from '@/shared/lib/i18n/server';

type TFunction = (key: string, opts?: { defaultValue?: string }) => string;
const mockT = vi.fn<TFunction>();
const translations: Record<string, string> = {};

beforeEach(() => {
  Object.keys(translations).forEach((k) => delete translations[k]);
  mockT.mockReset();
  mockT.mockImplementation((key, opts) => translations[key] ?? opts?.defaultValue ?? `t:${key}`);
  vi.mocked(getT).mockResolvedValue({ t: mockT } as never);
});

describe('SITE_URL construction', () => {
  it('uses NEXT_PUBLIC_SITE_URL and strips multiple trailing slashes', async () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://custom.test///');
    vi.stubEnv('BASE_URL', 'https://base.test/');
    vi.resetModules();
    const mod = await import('./metadata');
    expect(mod.SITE_URL).toBe('https://custom.test');
    vi.unstubAllEnvs();
  });

  it('uses BASE_URL fallback and strips trailing slash', async () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', '');
    vi.stubEnv('BASE_URL', 'https://base.test/');
    vi.resetModules();
    const mod = await import('./metadata');
    expect(mod.SITE_URL).toBe('https://base.test');
    vi.unstubAllEnvs();
  });
});

describe('SITE_URL fallback', () => {
  it('falls back to hardcoded default when env vars are missing', async () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', '');
    vi.stubEnv('BASE_URL', '');
    vi.resetModules();
    const mod = await import('./metadata');
    expect(mod.SITE_URL).toBe('https://pipelinestudios.com');
    vi.unstubAllEnvs();
  });
});

describe('buildMetadata', () => {
  it('builds canonical url from locale + path', () => {
    const meta = buildMetadata({ locale: 'en', path: '/about' });
    expect(meta.alternates?.canonical).toBe('/en/about');
  });

  it('builds url without path', () => {
    const meta = buildMetadata({ locale: 'en' });
    expect(meta.alternates?.canonical).toBe('/en');
  });

  it('maps en to en_US', () => {
    const meta = buildMetadata({ locale: 'en' });
    expect(meta.openGraph).toMatchObject({ locale: 'en_US' });
  });

  it('maps uk to uk_UA', () => {
    const meta = buildMetadata({ locale: 'uk' });
    expect(meta.openGraph).toMatchObject({ locale: 'uk_UA' });
  });

  it('falls back to en_US for legacy ua locale', () => {
    const meta = buildMetadata({ locale: 'ua' });
    expect(meta.openGraph).toMatchObject({ locale: 'en_US' });
  });

  it('falls back to en for unknown locale', () => {
    const meta = buildMetadata({ locale: 'de' });
    expect(meta.openGraph).toMatchObject({ locale: 'en_US' });
  });

  it('excludes own locale from alternateLocale', () => {
    const meta = buildMetadata({ locale: 'en' });
    const og = meta.openGraph as { alternateLocale?: string[] };
    expect(og.alternateLocale).toEqual(['uk_UA']);
  });

  it('falls back to SITE_NAME for OG title', () => {
    const meta = buildMetadata({ locale: 'en' });
    expect(meta.openGraph).toMatchObject({ title: SITE_NAME });
  });

  it('uses explicit title for OG when provided', () => {
    const meta = buildMetadata({ locale: 'en', title: 'Custom' });
    expect(meta.openGraph).toMatchObject({ title: 'Custom' });
  });

  it('sets languages alternates', () => {
    const meta = buildMetadata({ locale: 'en', path: '/x' });
    expect(meta.alternates?.languages).toEqual({
      en: '/en/x',
      uk: '/uk/x',
      'x-default': '/en/x',
    });
  });

  it('sets twitter card metadata', () => {
    const meta = buildMetadata({ locale: 'en', title: 'T', description: 'D' });
    expect(meta.twitter).toMatchObject({
      card: 'summary_large_image',
      title: 'T',
      description: 'D',
    });
  });
});

describe('getPageMetadata', () => {
  it('uses explicit title', async () => {
    const meta = await getPageMetadata('en', 'ns', '/x', { title: 'Explicit' });
    expect(meta.openGraph).toMatchObject({ title: 'Explicit' });
  });

  it('resolves title by key', async () => {
    translations['title.key'] = 'From Key';
    const meta = await getPageMetadata('en', 'ns', '/x', { titleKey: 'title.key' });
    expect(meta.openGraph).toMatchObject({ title: 'From Key' });
  });

  it('falls back to meta.title when no key', async () => {
    translations['meta.title'] = 'Default Title';
    const meta = await getPageMetadata('en', 'ns', '/x');
    expect(meta.openGraph).toMatchObject({ title: 'Default Title' });
  });

  it('falls back to meta.title when key missing', async () => {
    translations['meta.title'] = 'Default Title';
    const meta = await getPageMetadata('en', 'ns', '/x', { titleKey: 'missing.key' });
    expect(meta.openGraph).toMatchObject({ title: 'Default Title' });
  });

  it('uses fallbackTitleKey when primary key missing', async () => {
    translations['fallback.key'] = 'Fallback Title';
    const meta = await getPageMetadata('en', 'ns', '/x', {
      titleKey: 'missing.key',
      fallbackTitleKey: 'fallback.key',
    });
    expect(meta.openGraph).toMatchObject({ title: 'Fallback Title' });
  });

  it('resolves description by key', async () => {
    translations['desc.key'] = 'From Desc Key';
    const meta = await getPageMetadata('en', 'ns', '/x', { descriptionKey: 'desc.key' });
    expect(meta.openGraph).toMatchObject({ description: 'From Desc Key' });
  });

  it('uses meta.description fallback', async () => {
    translations['meta.description'] = 'Default Desc';
    const meta = await getPageMetadata('en', 'ns', '/x');
    expect(meta.openGraph).toMatchObject({ description: 'Default Desc' });
  });
});

describe('getRootMetadata', () => {
  beforeEach(() => {
    translations['meta.description'] = 'Root Desc';
  });

  it('sets metadataBase from SITE_URL', async () => {
    const meta = await getRootMetadata('en');
    expect(meta.metadataBase).toEqual(new URL(SITE_URL));
  });

  it('sets title template', async () => {
    const meta = await getRootMetadata('en');
    expect(meta.title).toEqual({ default: SITE_NAME, template: `%s | ${SITE_NAME}` });
  });

  it('includes icon set', async () => {
    const meta = await getRootMetadata('en');
    const icons = meta.icons as { icon?: unknown; apple?: unknown } | undefined;
    expect(icons?.icon).toBeDefined();
    expect(icons?.apple).toBeDefined();
  });
});
