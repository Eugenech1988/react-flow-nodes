import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('next/cache', () => ({
  revalidateTag: vi.fn(),
  revalidatePath: vi.fn(),
}));

vi.mock('./trpc', () => ({
  trpcFetch: vi.fn(),
}));

import { revalidatePath, revalidateTag } from 'next/cache';
import { getJobBySlug, getPublishedJobs, incrementJobViews } from './jobs';
import { trpcFetch } from './trpc';

const makeTranslation = (overrides: Record<string, unknown> = {}) => ({
  id: 't1',
  jobId: 'j1',
  locale: 'en',
  title: 'Title',
  description: 'Desc',
  responsibilities: [] as string[],
  requirements: [] as string[],
  metaTitle: null,
  metaDescription: null,
  ...overrides,
});

const makeJob = (overrides: Record<string, unknown> = {}) => ({
  id: 'j1',
  slug: 'job-1',
  status: 'PUBLISHED',
  department: 'ENGINEERING',
  level: 'SENIOR',
  type: 'FULL_TIME',
  location: 'Remote',
  icon: null,
  authorId: null,
  publishedAt: null,
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
  translations: [makeTranslation()],
  views: 0,
  applications: 0,
  ...overrides,
});

beforeEach(() => {
  vi.mocked(trpcFetch).mockReset();
  vi.mocked(revalidateTag).mockReset();
  vi.mocked(revalidatePath).mockReset();
});

describe('getPublishedJobs', () => {
  it('returns [] when trpcFetch fails', async () => {
    vi.mocked(trpcFetch).mockResolvedValueOnce({ ok: false });
    expect(await getPublishedJobs('en')).toEqual([]);
  });

  it('passes jobs tag and 60s revalidate', async () => {
    vi.mocked(trpcFetch).mockResolvedValueOnce({ ok: true, data: [] });
    await getPublishedJobs('en');
    expect(trpcFetch).toHaveBeenCalledWith(
      'jobs.list',
      {},
      { schema: expect.anything(), next: { revalidate: 60, tags: ['jobs'] } },
    );
  });

  it('skips non-PUBLISHED jobs', async () => {
    vi.mocked(trpcFetch).mockResolvedValueOnce({
      ok: true,
      data: [makeJob({ status: 'DRAFT' }), makeJob({ id: 'j2', slug: 'job-2' })],
    });
    const jobs = await getPublishedJobs('en');
    expect(jobs).toHaveLength(1);
    expect(jobs[0].slug).toBe('job-2');
  });

  it('skips malformed jobs and logs warn', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.mocked(trpcFetch).mockResolvedValueOnce({
      ok: true,
      data: [{ invalid: true }, makeJob()],
    });
    const jobs = await getPublishedJobs('en');
    expect(jobs).toHaveLength(1);
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  it('localizes with matching locale', async () => {
    vi.mocked(trpcFetch).mockResolvedValueOnce({
      ok: true,
      data: [
        makeJob({
          translations: [
            makeTranslation({ locale: 'en', title: 'EN Title' }),
            makeTranslation({ locale: 'ua', title: 'UA Title' }),
          ],
        }),
      ],
    });
    const jobs = await getPublishedJobs('ua');
    expect(jobs[0].title).toBe('UA Title');
  });

  it('treats uk as ua', async () => {
    vi.mocked(trpcFetch).mockResolvedValueOnce({
      ok: true,
      data: [
        makeJob({ translations: [makeTranslation({ locale: 'ua', title: 'UA Title' })] }),
      ],
    });
    const jobs = await getPublishedJobs('uk');
    expect(jobs[0].title).toBe('UA Title');
  });

  it('falls back to en when target locale missing', async () => {
    vi.mocked(trpcFetch).mockResolvedValueOnce({
      ok: true,
      data: [
        makeJob({ translations: [makeTranslation({ locale: 'en', title: 'EN Title' })] }),
      ],
    });
    const jobs = await getPublishedJobs('de');
    expect(jobs[0].title).toBe('EN Title');
  });

  it('skips job when no translation at all', async () => {
    vi.mocked(trpcFetch).mockResolvedValueOnce({
      ok: true,
      data: [makeJob({ translations: [] })],
    });
    expect(await getPublishedJobs('en')).toEqual([]);
  });

  it('defaults views/applications to 0 for null', async () => {
    vi.mocked(trpcFetch).mockResolvedValueOnce({
      ok: true,
      data: [makeJob({ views: null, applications: null })],
    });
    const jobs = await getPublishedJobs('en');
    expect(jobs[0].views).toBe(0);
    expect(jobs[0].applications).toBe(0);
  });

  it('coerces string views to number', async () => {
    vi.mocked(trpcFetch).mockResolvedValueOnce({
      ok: true,
      data: [makeJob({ views: '42', applications: '7' })],
    });
    const jobs = await getPublishedJobs('en');
    expect(jobs[0].views).toBe(42);
    expect(jobs[0].applications).toBe(7);
  });

  it('defaults responsibilities/requirements to [] when null', async () => {
    vi.mocked(trpcFetch).mockResolvedValueOnce({
      ok: true,
      data: [
        makeJob({
          translations: [makeTranslation({ responsibilities: null, requirements: null })],
        }),
      ],
    });
    const jobs = await getPublishedJobs('en');
    expect(jobs[0].responsibilities).toEqual([]);
    expect(jobs[0].requirements).toEqual([]);
  });
});

describe('getJobBySlug', () => {
  it('returns matching job', async () => {
    vi.mocked(trpcFetch).mockResolvedValueOnce({
      ok: true,
      data: [makeJob({ slug: 'a' }), makeJob({ id: 'j2', slug: 'b' })],
    });
    const job = await getJobBySlug('en', 'b');
    expect(job?.slug).toBe('b');
  });

  it('returns null when not found', async () => {
    vi.mocked(trpcFetch).mockResolvedValueOnce({ ok: true, data: [] });
    expect(await getJobBySlug('en', 'missing')).toBeNull();
  });
});

describe('incrementJobViews', () => {
  it('returns false on trpcFetch failure', async () => {
    vi.mocked(trpcFetch).mockResolvedValueOnce({ ok: false });
    expect(await incrementJobViews('j1', 'slug', 'en')).toBe(false);
    expect(revalidateTag).not.toHaveBeenCalled();
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it('calls revalidateTag("jobs","max") and revalidatePath on success', async () => {
    vi.mocked(trpcFetch).mockResolvedValueOnce({ ok: true, data: null });
    expect(await incrementJobViews('j1', 'slug', 'en')).toBe(true);
    expect(revalidateTag).toHaveBeenCalledWith('jobs', 'max');
    expect(revalidatePath).toHaveBeenCalledWith('/en/careers/slug');
  });
});
