import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { PortalRevalidateService } from '../portal-revalidate.service';

const mockFetch = jest.fn();
global.fetch = mockFetch as unknown as typeof fetch;

const createConfigMock = (overrides: Record<string, string | undefined> = {}) => ({
  get: jest.fn((key: string) => {
    const defaults: Record<string, string> = {
      PORTAL_URL: 'https://portal.example.com',
      REVALIDATE_SECRET: 'secret-123',
    };
    return { ...defaults, ...overrides }[key];
  }),
});

describe('PortalRevalidateService', () => {
  let service: PortalRevalidateService;

  const build = async (
    overrides?: Record<string, string | undefined>,
  ): Promise<PortalRevalidateService> => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PortalRevalidateService,
        { provide: ConfigService, useValue: createConfigMock(overrides) },
      ],
    }).compile();

    return module.get<PortalRevalidateService>(PortalRevalidateService);
  };

  const spyOnLogger = (
    instance: PortalRevalidateService,
    method: 'warn' | 'error',
  ): jest.SpyInstance =>
    jest
      .spyOn(instance['logger'] as unknown as Record<string, jest.Mock>, method)
      .mockImplementation(() => {});

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    service = await build();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('scheduleRevalidate', () => {
    it('does not send request immediately', () => {
      mockFetch.mockResolvedValue({ ok: true });

      service.scheduleRevalidate(['jobs']);

      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('sends POST after debounce delay with correct headers and body', async () => {
      mockFetch.mockResolvedValue({ ok: true });

      service.scheduleRevalidate(['jobs']);
      jest.advanceTimersByTime(500);
      await jest.runOnlyPendingTimersAsync();

      expect(mockFetch).toHaveBeenCalledWith(
        'https://portal.example.com/api/revalidate',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-revalidate-secret': 'secret-123',
          },
          body: JSON.stringify({ tags: ['jobs'] }),
        }),
      );
    });

    it('uses default tag ["jobs"] when called without arguments', async () => {
      mockFetch.mockResolvedValue({ ok: true });

      service.scheduleRevalidate();
      jest.advanceTimersByTime(500);
      await jest.runOnlyPendingTimersAsync();

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: JSON.stringify({ tags: ['jobs'] }),
        }),
      );
    });

    it('accepts multiple tags in one call', async () => {
      mockFetch.mockResolvedValue({ ok: true });

      service.scheduleRevalidate(['jobs', 'blog']);
      jest.advanceTimersByTime(500);
      await jest.runOnlyPendingTimersAsync();

      const [, init] = mockFetch.mock.calls[0] as [string, { body: string }];
      const body = JSON.parse(init.body) as { tags: string[] };

      expect(body.tags.sort()).toEqual(['blog', 'jobs']);
    });
  });

  describe('debounce behavior', () => {
    it('batches multiple calls into a single request', async () => {
      mockFetch.mockResolvedValue({ ok: true });

      service.scheduleRevalidate(['jobs']);
      service.scheduleRevalidate(['blog']);
      service.scheduleRevalidate(['jobs']);

      jest.advanceTimersByTime(500);
      await jest.runOnlyPendingTimersAsync();

      expect(mockFetch).toHaveBeenCalledTimes(1);

      const [, init] = mockFetch.mock.calls[0] as [string, { body: string }];
      const body = JSON.parse(init.body) as { tags: string[] };
      expect(body.tags.sort()).toEqual(['blog', 'jobs']);
    });

    it('accumulates tags across debounce window', async () => {
      mockFetch.mockResolvedValue({ ok: true });

      service.scheduleRevalidate(['jobs']);
      jest.advanceTimersByTime(250);
      service.scheduleRevalidate(['blog']);
      jest.advanceTimersByTime(500);
      await jest.runOnlyPendingTimersAsync();

      expect(mockFetch).toHaveBeenCalledTimes(1);

      const [, init] = mockFetch.mock.calls[0] as [string, { body: string }];
      const body = JSON.parse(init.body) as { tags: string[] };
      expect(body.tags.sort()).toEqual(['blog', 'jobs']);
    });

    it('clears pending tags after flush', async () => {
      mockFetch.mockResolvedValue({ ok: true });

      service.scheduleRevalidate(['jobs']);
      jest.advanceTimersByTime(500);
      await jest.runOnlyPendingTimersAsync();

      expect(mockFetch).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(1000);
      await jest.runOnlyPendingTimersAsync();

      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('does not send anything when there are no pending tags', async () => {
      mockFetch.mockResolvedValue({ ok: true });

      jest.advanceTimersByTime(500);
      await jest.runOnlyPendingTimersAsync();

      expect(mockFetch).not.toHaveBeenCalled();
    });
  });

  describe('config validation', () => {
    it('logs warning and skips request when PORTAL_URL is missing', async () => {
      const local = await build({ PORTAL_URL: undefined });
      const warnSpy = spyOnLogger(local, 'warn');

      mockFetch.mockResolvedValue({ ok: true });

      local.scheduleRevalidate(['jobs']);
      jest.advanceTimersByTime(500);
      await jest.runOnlyPendingTimersAsync();

      expect(mockFetch).not.toHaveBeenCalled();
      expect(warnSpy).toHaveBeenCalledWith('PORTAL_URL or REVALIDATE_SECRET is not configured');
    });

    it('logs warning and skips request when REVALIDATE_SECRET is missing', async () => {
      const local = await build({ REVALIDATE_SECRET: undefined });
      const warnSpy = spyOnLogger(local, 'warn');

      mockFetch.mockResolvedValue({ ok: true });

      local.scheduleRevalidate(['jobs']);
      jest.advanceTimersByTime(500);
      await jest.runOnlyPendingTimersAsync();

      expect(mockFetch).not.toHaveBeenCalled();
      expect(warnSpy).toHaveBeenCalledWith('PORTAL_URL or REVALIDATE_SECRET is not configured');
    });
  });

  describe('error handling', () => {
    it('logs warning when portal returns non-ok status', async () => {
      mockFetch.mockResolvedValue({ ok: false, status: 500 });
      const warnSpy = spyOnLogger(service, 'warn');

      service.scheduleRevalidate(['jobs']);
      jest.advanceTimersByTime(500);
      await jest.runOnlyPendingTimersAsync();

      expect(warnSpy).toHaveBeenCalledWith(
        'Portal revalidate failed with status 500 for tags [jobs]',
      );
    });

    it('logs error on network failure', async () => {
      const networkError = new Error('network down');
      mockFetch.mockRejectedValue(networkError);
      const errorSpy = spyOnLogger(service, 'error');

      service.scheduleRevalidate(['jobs']);
      jest.advanceTimersByTime(500);
      await jest.runOnlyPendingTimersAsync();

      expect(errorSpy).toHaveBeenCalledWith('Portal revalidate network error', networkError);
    });
  });
});
