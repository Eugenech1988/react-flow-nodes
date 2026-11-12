import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('./trpc', () => ({
  getApiUrl: vi.fn(),
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

import { submitJobApplication } from './applications';
import { getApiUrl } from './trpc';
import { revalidatePath } from 'next/cache';

beforeEach(() => {
  mockFetch.mockReset();
  vi.mocked(getApiUrl).mockReset();
  vi.mocked(revalidatePath).mockReset();
});

describe('submitJobApplication', () => {
  it('returns false when getApiUrl null', async () => {
    vi.mocked(getApiUrl).mockReturnValue(null);
    expect(await submitJobApplication(new FormData(), 'slug', 'en')).toBe(false);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('POSTs FormData to /applications', async () => {
    vi.mocked(getApiUrl).mockReturnValue('https://api.test');
    mockFetch.mockResolvedValueOnce({ ok: true });
    const fd = new FormData();
    fd.append('name', 'X');
    await submitJobApplication(fd, 'slug', 'en');
    expect(mockFetch).toHaveBeenCalledWith('https://api.test/applications', {
      method: 'POST',
      body: fd,
    });
  });

  it('returns true and revalidates on success', async () => {
    vi.mocked(getApiUrl).mockReturnValue('https://api.test');
    mockFetch.mockResolvedValueOnce({ ok: true });
    expect(await submitJobApplication(new FormData(), 'slug', 'en')).toBe(true);
    expect(revalidatePath).toHaveBeenCalledWith('/en/careers/slug');
  });

  it('returns false and logs on non-2xx', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(getApiUrl).mockReturnValue('https://api.test');
    mockFetch.mockResolvedValueOnce({ ok: false, text: async () => 'err' });
    expect(await submitJobApplication(new FormData(), 'slug', 'en')).toBe(false);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('returns false on fetch throw', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(getApiUrl).mockReturnValue('https://api.test');
    mockFetch.mockRejectedValueOnce(new Error('network'));
    expect(await submitJobApplication(new FormData(), 'slug', 'en')).toBe(false);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
