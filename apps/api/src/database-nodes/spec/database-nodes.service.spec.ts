import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseNodesService } from '@/database-nodes/database-nodes.service';
import { PrismaService } from '@/prisma/prisma.service';

describe('DatabaseNodesService', () => {
  let service: DatabaseNodesService;
  let prisma: PrismaService;

  const mockPrismaService = {
    databaseNode: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DatabaseNodesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<DatabaseNodesService>(DatabaseNodesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createRecord', () => {
    it('should create a database node record', async () => {
      const mockRecord = {
        id: 'record-1',
        nodeId: 'node-123',
        pipelineId: 'pipe-1',
        query: 'SELECT 1',
        params: {},
        data: { rows: [] },
        status: 'SUCCESS',
        userId: 'user-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockPrismaService.databaseNode.create.mockResolvedValue(mockRecord);

      const result = await service.createRecord('user-1', {
        nodeId: 'node-123',
        pipelineId: 'pipe-1',
        query: 'SELECT 1',
        params: {},
        data: { rows: [] },
        status: 'SUCCESS',
      });

      expect(mockPrismaService.databaseNode.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          nodeId: 'node-123',
          pipelineId: 'pipe-1',
          query: 'SELECT 1',
          status: 'SUCCESS',
          userId: 'user-1',
        }),
      });
      expect(result).toEqual(mockRecord);
    });
  });

  describe('findByNodeId', () => {
    it('should return records matching nodeId', async () => {
      const mockRecords = [{ id: '1', nodeId: 'node-123' }];
      mockPrismaService.databaseNode.findMany.mockResolvedValue(mockRecords);

      const result = await service.findByNodeId('node-123');

      expect(mockPrismaService.databaseNode.findMany).toHaveBeenCalledWith({
        where: { nodeId: 'node-123' },
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual(mockRecords);
    });
  });
});
