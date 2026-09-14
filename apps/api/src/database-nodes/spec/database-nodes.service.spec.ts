import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseNodesService } from '@/database-nodes/database-nodes.service';
import { PrismaService } from '@/prisma/prisma.service';
import { InternalServerErrorException } from '@nestjs/common';

describe('DatabaseNodesService', () => {
  let service: DatabaseNodesService;
  let prismaService: {
    $queryRawUnsafe: jest.Mock;
    databaseNode: {
      findFirst: jest.Mock;
      update: jest.Mock;
      create: jest.Mock;
      findMany: jest.Mock;
      findUnique: jest.Mock;
    };
  };

  const mockPrismaService = {
    $queryRawUnsafe: jest.fn(),
    databaseNode: {
      findFirst: jest.fn(),
      update: jest.fn(),
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
    prismaService = module.get(PrismaService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createRecord', () => {
    const userId = 'user-1';
    const validDto = {
      nodeId: 'node-1',
      pipelineId: 'pipeline-1',
      query: 'SELECT * FROM users',
      params: {},
    };

    it('should throw an error if the query does not start with SELECT', async () => {
      const invalidDto = { ...validDto, query: 'DELETE FROM users' };

      await expect(service.createRecord(userId, invalidDto)).rejects.toThrow(
        'Only SELECT queries are allowed for security reasons.',
      );
      expect(prismaService.$queryRawUnsafe).not.toHaveBeenCalled();
    });

    it('should create a new database node record if it does not exist', async () => {
      const queryResult = [{ id: 1, name: 'Test' }];
      prismaService.$queryRawUnsafe.mockResolvedValueOnce(queryResult);
      prismaService.databaseNode.findFirst.mockResolvedValueOnce(null);
      prismaService.databaseNode.create.mockResolvedValueOnce({
        id: 'record-1',
        ...validDto,
        data: queryResult,
        status: 'SUCCESS',
        userId,
      });

      const result = await service.createRecord(userId, validDto);

      expect(prismaService.$queryRawUnsafe).toHaveBeenCalledWith(validDto.query);
      expect(prismaService.databaseNode.findFirst).toHaveBeenCalledWith({
        where: { nodeId: validDto.nodeId, pipelineId: validDto.pipelineId },
      });
      expect(prismaService.databaseNode.create).toHaveBeenCalled();
      expect(result).toHaveProperty('id', 'record-1');
    });

    it('should update an existing database node record if it already exists', async () => {
      const queryResult = [{ id: 1, name: 'Test' }];
      const existingRecord = { id: 'record-1', nodeId: 'node-1', pipelineId: 'pipeline-1' };

      prismaService.$queryRawUnsafe.mockResolvedValueOnce(queryResult);
      prismaService.databaseNode.findFirst.mockResolvedValueOnce(existingRecord);
      prismaService.databaseNode.update.mockResolvedValueOnce({
        id: 'record-1',
        ...validDto,
        data: queryResult,
        status: 'SUCCESS',
        userId,
      });

      const result = await service.createRecord(userId, validDto);

      expect(prismaService.databaseNode.findFirst).toHaveBeenCalled();
      expect(prismaService.databaseNode.update).toHaveBeenCalledWith({
        where: { id: existingRecord.id },
        data: expect.objectContaining({
          query: validDto.query,
          status: 'SUCCESS',
        }),
      });
      expect(result).toHaveProperty('id', 'record-1');
    });

    it('should throw InternalServerErrorException if saving to db fails', async () => {
      prismaService.$queryRawUnsafe.mockResolvedValueOnce([]);
      prismaService.databaseNode.findFirst.mockRejectedValueOnce(new Error('DB Error'));

      await expect(service.createRecord(userId, validDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findByNodeId', () => {
    it('should return records by nodeId', async () => {
      const mockRecords = [{ id: '1', nodeId: 'node-1' }];
      prismaService.databaseNode.findMany.mockResolvedValueOnce(mockRecords);

      const result = await service.findByNodeId('node-1');

      expect(prismaService.databaseNode.findMany).toHaveBeenCalledWith({
        where: { nodeId: 'node-1' },
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual(mockRecords);
    });
  });

  describe('findByPipelineId', () => {
    it('should return records by pipelineId', async () => {
      const mockRecords = [{ id: '1', pipelineId: 'pipeline-1' }];
      prismaService.databaseNode.findMany.mockResolvedValueOnce(mockRecords);

      const result = await service.findByPipelineId('pipeline-1');

      expect(prismaService.databaseNode.findMany).toHaveBeenCalledWith({
        where: { pipelineId: 'pipeline-1' },
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual(mockRecords);
    });
  });

  describe('findById', () => {
    it('should return a record by id', async () => {
      const mockRecord = { id: '1', nodeId: 'node-1' };
      prismaService.databaseNode.findUnique.mockResolvedValueOnce(mockRecord);

      const result = await service.findById('1');

      expect(prismaService.databaseNode.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(result).toEqual(mockRecord);
    });

    it('should throw NotFoundException if record is not found', async () => {
      prismaService.databaseNode.findUnique.mockResolvedValueOnce(null);

      await expect(service.findById('non-existent')).rejects.toThrow(
        'Database node record not found',
      );
    });
  });
});