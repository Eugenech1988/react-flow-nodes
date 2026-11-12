import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('./trpc', () => ({
  trpcFetch: vi.fn(),
}));

import { sendInquiry } from './mail';
import { trpcFetch } from './trpc';

const INPUT = {
  type: 'demo' as const,
  name: 'John',
  email: 'john@example.com',
  company: 'Acme',
  position: 'Dev',
  message: 'Hello there',
};

beforeEach(() => {
  vi.mocked(trpcFetch).mockReset();
});

describe('sendInquiry', () => {
  it('returns true and forwards to mail.sendInquiry', async () => {
    vi.mocked(trpcFetch).mockResolvedValueOnce({ ok: true, data: null });
    expect(await sendInquiry(INPUT)).toBe(true);
    expect(trpcFetch).toHaveBeenCalledWith('mail.sendInquiry', INPUT, { method: 'POST' });
  });

  it('returns false when trpcFetch fails', async () => {
    vi.mocked(trpcFetch).mockResolvedValueOnce({ ok: false });
    expect(await sendInquiry(INPUT)).toBe(false);
  });
});
