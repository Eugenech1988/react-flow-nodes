import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { TCreatePipelineInputData, TUpdatePipelineInputData } from '@pipeline/contracts';
import { pipelineService } from './pipelineService';

interface IApiMock {
  post: ReturnType<typeof vi.fn>;
}

interface ITrpcMock {
  pipelines: {
    update: { mutate: ReturnType<typeof vi.fn> };
    remove: { mutate: ReturnType<typeof vi.fn> };
  };
  users: {
    setCurrentPipeline: { mutate: ReturnType<typeof vi.fn> };
  };
}

const mocks = vi.hoisted<{ api: IApiMock; trpcClient: ITrpcMock }>(() => ({
  api: { post: vi.fn() },
  trpcClient: {
    pipelines: {
      update: { mutate: vi.fn() },
      remove: { mutate: vi.fn() },
    },
    users: {
      setCurrentPipeline: { mutate: vi.fn() },
    },
  },
}));

vi.mock('@/shared/api', () => ({
  api: mocks.api,
  trpcClient: mocks.trpcClient,
}));

const createData: TCreatePipelineInputData = { name: 'My Pipeline' };

const updateData: TUpdatePipelineInputData = {
  id: 'p1',
  name: 'Updated',
  description: 'desc',
  status: 'DRAFT',
};

describe('pipelineService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('create', () => {
    it('uses REST FormData with name only when no file', async () => {
      mocks.api.post.mockResolvedValue({ id: 'p1' });

      await pipelineService.create({ data: createData });

      expect(mocks.api.post).toHaveBeenCalledTimes(1);
      const [endpoint, formData] = mocks.api.post.mock.calls[0];
      expect(endpoint).toBe('/pipelines');
      expect(formData).toBeInstanceOf(FormData);
      expect((formData as FormData).get('name')).toBe('My Pipeline');
      expect((formData as FormData).get('description')).toBeNull();
      expect((formData as FormData).get('file')).toBeNull();
    });

    it('includes description when provided', async () => {
      mocks.api.post.mockResolvedValue({ id: 'p1' });

      await pipelineService.create({
        data: { name: 'P', description: 'desc' },
      });

      const formData = mocks.api.post.mock.calls[0][1] as FormData;
      expect(formData.get('description')).toBe('desc');
    });

    it('includes file when provided', async () => {
      mocks.api.post.mockResolvedValue({ id: 'p1' });
      const file = new File(['x'], 'cover.png', { type: 'image/png' });

      await pipelineService.create({ data: createData, file });

      const formData = mocks.api.post.mock.calls[0][1] as FormData;
      expect(formData.get('file')).toBeInstanceOf(File);
    });

    it('returns the API response', async () => {
      mocks.api.post.mockResolvedValue({ id: 'p1' });

      const result = await pipelineService.create({ data: createData });

      expect(result).toEqual({ id: 'p1' });
    });
  });

  describe('update', () => {
    it('throws when id is missing', async () => {
      await expect(
        pipelineService.update({ name: 'X' } as TUpdatePipelineInputData),
      ).rejects.toThrow('Pipeline ID is required for update');
      expect(mocks.trpcClient.pipelines.update.mutate).not.toHaveBeenCalled();
    });

    it('calls trpcClient.pipelines.update.mutate with full payload', async () => {
      mocks.trpcClient.pipelines.update.mutate.mockResolvedValue({ ok: true });

      await pipelineService.update(updateData);

      expect(mocks.trpcClient.pipelines.update.mutate).toHaveBeenCalledWith(updateData);
    });
  });

  describe('remove', () => {
    it('calls trpcClient.pipelines.remove.mutate with { id }', async () => {
      mocks.trpcClient.pipelines.remove.mutate.mockResolvedValue({ ok: true });

      await pipelineService.remove('p1');

      expect(mocks.trpcClient.pipelines.remove.mutate).toHaveBeenCalledWith({ id: 'p1' });
    });
  });

  describe('setCurrent', () => {
    it('forwards all fields to trpcClient.users.setCurrentPipeline', async () => {
      mocks.trpcClient.users.setCurrentPipeline.mutate.mockResolvedValue({ id: 'u1' });
      const payload = {
        id: 'p1',
        name: 'Pipeline',
        description: 'desc',
        status: 'ACTIVE' as const,
        lastRunAt: '2024-01-01T00:00:00Z',
        lastRunStatus: 'SUCCESS' as const,
        screenshotUrl: '/uploads/a.png',
      };

      await pipelineService.setCurrent(payload);

      expect(mocks.trpcClient.users.setCurrentPipeline.mutate).toHaveBeenCalledWith(payload);
    });
  });
});
