import { describe, it, expect, vi, beforeEach } from 'vitest';
import { pipelineExecutionService } from './pipelineExecutionService';
import type { TExecutionLog } from '@/entities';

const { mockCreate, mockUpdate } = vi.hoisted(() => ({
  mockCreate: vi.fn(),
  mockUpdate: vi.fn(),
}));

vi.mock('@/shared/api', () => ({
  trpcClient: {
    executions: {
      create: { mutate: mockCreate },
      update: { mutate: mockUpdate },
    },
  },
}));

const makeLog = (overrides: Partial<TExecutionLog> = {}): TExecutionLog => ({
  id: 'l1',
  type: 'info',
  message: 'hi',
  timestamp: 12345,
  ...overrides,
});

describe('pipelineExecutionService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  describe('startExecution', () => {
    it('returns id on success', async () => {
      mockCreate.mockResolvedValue({ id: 'exec-1' });

      const result = await pipelineExecutionService.startExecution({
        pipelineId: 'p1',
        triggeredBy: 'MANUAL',
      });

      expect(result).toBe('exec-1');
      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          pipelineId: 'p1',
          triggeredBy: 'MANUAL',
          status: 'RUNNING',
          nodesExecuted: 0,
        })
      );
    });

    it('returns null when response has no id', async () => {
      mockCreate.mockResolvedValue({});
      const result = await pipelineExecutionService.startExecution({ pipelineId: 'p1' });
      expect(result).toBeNull();
    });

    it('returns null and logs error on failure', async () => {
      mockCreate.mockRejectedValue(new Error('network'));
      const result = await pipelineExecutionService.startExecution({ pipelineId: 'p1' });

      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalledWith(
        '[PipelineExecutionService] Failed to create execution in BE:',
        expect.any(Error)
      );
    });

    it('maps SCHEDULED trigger to CRON', async () => {
      mockCreate.mockResolvedValue({ id: 'x' });
      await pipelineExecutionService.startExecution({
        pipelineId: 'p1',
        triggeredBy: 'SCHEDULED',
      });

      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({ triggeredBy: 'CRON' })
      );
    });

    it('includes formatted logs', async () => {
      mockCreate.mockResolvedValue({ id: 'x' });
      await pipelineExecutionService.startExecution({
        pipelineId: 'p1',
        logs: [makeLog()],
      });

      const call = mockCreate.mock.calls[0][0];
      expect(call.logs['l1']).toBeDefined();
      expect(call.logs['l1'].message).toBe('hi');
    });

    it('uses empty object when no logs provided', async () => {
      mockCreate.mockResolvedValue({ id: 'x' });
      await pipelineExecutionService.startExecution({ pipelineId: 'p1' });

      const call = mockCreate.mock.calls[0][0];
      expect(call.logs).toEqual({});
    });
  });

  describe('finishExecution', () => {
    it('calls update mutation', async () => {
      mockUpdate.mockResolvedValue({});

      await pipelineExecutionService.finishExecution('exec-1', {
        status: 'SUCCESS',
        finishedAt: '2024-01-01',
        durationMs: 1234,
        nodesExecuted: 5,
        logs: [makeLog()],
      });

      expect(mockUpdate).toHaveBeenCalledWith({
        id: 'exec-1',
        data: expect.objectContaining({
          status: 'SUCCESS',
          finishedAt: '2024-01-01',
          durationMs: 1234,
          nodesExecuted: 5,
        }),
      });
    });

    it('logs error on failure without throwing', async () => {
      mockUpdate.mockRejectedValue(new Error('network'));

      await expect(
        pipelineExecutionService.finishExecution('exec-1', {
          status: 'FAILED',
          finishedAt: '2024-01-01',
          durationMs: 0,
          nodesExecuted: 0,
          logs: [],
        })
      ).resolves.not.toThrow();

      expect(console.error).toHaveBeenCalled();
    });
  });
});
