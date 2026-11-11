import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ExecutionsService } from '@/executions/executions.service';
import { PrismaService } from '@/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import type { TCreateExecutionInputData } from '@pipeline/contracts';

const mockExecution = {
  id: 'exec_123',
  pipelineId: 'pipe_123',
  userId: 'user_123',
  status: 'RUNNING' as const,
  triggeredBy: 'MANUAL' as const,
  startedAt: new Date('2026-01-01T10:00:00.000Z'),
  finishedAt: null,
  durationMs: null,
  nodesExecuted: 0,
  logs: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  pipeline: { id: 'pipe_123', name: 'Test Pipeline' },
};

const mockPrismaService = {
  execution: {
    create: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('ExecutionsService', () => {
  let service: ExecutionsService;
  let prisma: typeof mockPrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExecutionsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ExecutionsService>(ExecutionsService);
    prisma = module.get(PrismaService);

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create an execution and return formatted duration', async () => {
      prisma.execution.create.mockResolvedValue(mockExecution);

      const dto: TCreateExecutionInputData = {
        pipelineId: 'pipe_123',
        userId: 'user_123',
        status: 'RUNNING',
        triggeredBy: 'MANUAL',
        nodesExecuted: 0,
      };

      const result = await service.create(dto);

      expect(prisma.execution.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          pipelineId: 'pipe_123',
          userId: 'user_123',
          status: 'RUNNING',
          triggeredBy: 'MANUAL',
        }),
        include: { pipeline: { select: { id: true, name: true } } },
      });
      expect(result).toHaveProperty('durationFormatted', null);
    });
  });

  describe('create — optional fields', () => {
    it('should pass logs through as JSON', async () => {
      prisma.execution.create.mockResolvedValue(mockExecution);

      const logs = {
        step1: {
          timestamp: 1735725600000,
          type: 'info' as const,
          message: 'step ok',
        },
      };

      await service.create({
        pipelineId: 'pipe_123',
        userId: 'user_123',
        status: 'RUNNING',
        triggeredBy: 'MANUAL',
        nodesExecuted: 0,
        logs,
      });

      expect(prisma.execution.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ logs }),
        }),
      );
    });

    it('should store Prisma.JsonNull when logs is omitted', async () => {
      prisma.execution.create.mockResolvedValue(mockExecution);

      await service.create({
        pipelineId: 'pipe_123',
        userId: 'user_123',
        status: 'RUNNING',
        triggeredBy: 'MANUAL',
        nodesExecuted: 0,
      });

      const call = prisma.execution.create.mock.calls[0][0];
      expect(call.data.logs).toBe(Prisma.JsonNull);
    });
  });

  describe('findAll — filters & pagination', () => {
    it('should apply pipelineId, status, search, page and limit', async () => {
      prisma.execution.findMany.mockResolvedValue([]);
      prisma.execution.count.mockResolvedValue(0);

      await service.findAll({
        userId: 'user_123',
        pipelineId: 'pipe_123',
        page: 3,
        limit: 5,
        search: 'deploy',
        status: 'success',
      });

      expect(prisma.execution.findMany).toHaveBeenCalledWith({
        where: {
          userId: 'user_123',
          pipelineId: 'pipe_123',
          status: 'SUCCESS',
          OR: [
            { id: { contains: 'deploy', mode: 'insensitive' } },
            { pipeline: { name: { contains: 'deploy', mode: 'insensitive' } } },
          ],
        },
        skip: 10,
        take: 5,
        orderBy: { startedAt: 'desc' },
        include: { pipeline: { select: { id: true, name: true } } },
      });
    });

    it('should treat status="all" as no status filter', async () => {
      prisma.execution.findMany.mockResolvedValue([]);
      prisma.execution.count.mockResolvedValue(0);

      await service.findAll({ userId: 'user_123', status: 'all' });

      const arg = prisma.execution.findMany.mock.calls[0][0];
      expect(arg.where).not.toHaveProperty('status');
    });

    it('should fall back to defaults for non-positive page/limit', async () => {
      prisma.execution.findMany.mockResolvedValue([]);
      prisma.execution.count.mockResolvedValue(0);

      await service.findAll({ userId: 'user_123', page: 0, limit: -1 });

      expect(prisma.execution.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 0, take: 10 }),
      );
    });

    it('should ignore whitespace-only search', async () => {
      prisma.execution.findMany.mockResolvedValue([]);
      prisma.execution.count.mockResolvedValue(0);

      await service.findAll({ userId: 'user_123', search: '   ' });

      const arg = prisma.execution.findMany.mock.calls[0][0];
      expect(arg.where).not.toHaveProperty('OR');
    });
  });

  describe('update — duration handling', () => {
    it('should keep an explicitly provided durationMs', async () => {
      prisma.execution.findUnique.mockResolvedValue(mockExecution);
      prisma.execution.update.mockResolvedValue({
        ...mockExecution,
        status: 'SUCCESS',
        durationMs: 12345,
      });

      await service.update('exec_123', {
        status: 'SUCCESS',
        finishedAt: new Date('2026-01-01T10:01:30.000Z'),
        durationMs: 12345,
      });

      expect(prisma.execution.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ durationMs: 12345 }),
        }),
      );
    });

    it('should not compute durationMs when finishedAt is omitted', async () => {
      prisma.execution.findUnique.mockResolvedValue(mockExecution);
      prisma.execution.update.mockResolvedValue(mockExecution);

      await service.update('exec_123', { status: 'SUCCESS' });

      const arg = prisma.execution.update.mock.calls[0][0];
      expect(arg.data.durationMs).toBeUndefined();
    });
  });

  describe('findAll', () => {
    it('should return paginated result of executions with durationFormatted', async () => {
      prisma.execution.findMany.mockResolvedValue([{ ...mockExecution, durationMs: 65000 }]);
      prisma.execution.count.mockResolvedValue(1);

      const result = await service.findAll({ userId: 'user_123' });

      expect(result.items[0].durationFormatted).toBe('01.05');
      expect(result.total).toBe(1);
      expect(prisma.execution.findMany).toHaveBeenCalledWith({
        where: { userId: 'user_123' },
        skip: 0,
        take: 10,
        orderBy: { startedAt: 'desc' },
        include: { pipeline: { select: { id: true, name: true } } },
      });
      expect(prisma.execution.count).toHaveBeenCalledWith({
        where: { userId: 'user_123' },
      });
    });
  });

  describe('findOne', () => {
    it('should return execution if found', async () => {
      prisma.execution.findUnique.mockResolvedValue(mockExecution);

      const result = await service.findOne('exec_123');
      expect(result.id).toBe('exec_123');
    });

    it('should throw NotFoundException if execution does not exist', async () => {
      prisma.execution.findUnique.mockResolvedValue(null);

      await expect(service.findOne('non_existing')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update execution and calculate duration automatically if finishedAt provided', async () => {
      const finishedAt = new Date('2026-01-01T10:01:30.000Z');
      prisma.execution.findUnique.mockResolvedValue(mockExecution);
      prisma.execution.update.mockResolvedValue({
        ...mockExecution,
        status: 'SUCCESS',
        finishedAt,
        durationMs: 90000,
      });

      const result = await service.update('exec_123', {
        status: 'SUCCESS',
        finishedAt,
      });

      expect(prisma.execution.update).toHaveBeenCalledWith({
        where: { id: 'exec_123' },
        data: expect.objectContaining({
          status: 'SUCCESS',
          durationMs: 90000,
        }),
      });
      expect(result.durationFormatted).toBe('01.30');
    });
  });

  describe('remove', () => {
    it('should delete execution if exists', async () => {
      prisma.execution.findUnique.mockResolvedValue(mockExecution);
      prisma.execution.delete.mockResolvedValue(mockExecution);

      await service.remove('exec_123');

      expect(prisma.execution.delete).toHaveBeenCalledWith({ where: { id: 'exec_123' } });
    });
  });
});
