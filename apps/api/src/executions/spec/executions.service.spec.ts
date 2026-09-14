import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ExecutionsService } from '@/executions/executions.service';
import { PrismaService } from '@/prisma/prisma.service';
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

  describe('findAll', () => {
    it('should return array of executions with durationFormatted', async () => {
      prisma.execution.findMany.mockResolvedValue([{ ...mockExecution, durationMs: 65000 }]);

      const result = await service.findAll('user_123');

      expect(result[0].durationFormatted).toBe('01.05');
      expect(prisma.execution.findMany).toHaveBeenCalledWith({
        where: { userId: 'user_123' },
        orderBy: { startedAt: 'desc' },
        include: { pipeline: { select: { id: true, name: true } } },
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