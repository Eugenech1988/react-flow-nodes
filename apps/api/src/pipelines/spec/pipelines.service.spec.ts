import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PipelinesService } from '@/pipelines/pipelines.service';
import { PrismaService } from '@/prisma/prisma.service';
import * as fs from 'node:fs/promises';

jest.mock('node:fs/promises', () => ({
  unlink: jest.fn().mockResolvedValue(undefined),
  mkdir: jest.fn().mockResolvedValue(undefined),
  writeFile: jest.fn().mockResolvedValue(undefined),
}));

describe('PipelinesService', () => {
  let service: PipelinesService;
  let prisma: any;

  beforeEach(async () => {
    const mockPrisma = {
      pipeline: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PipelinesService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<PipelinesService>(PipelinesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a pipeline successfully without file', async () => {
      const dto = { name: 'Test Pipeline', description: 'Desc' };
      const expectedResult = { id: 'pipe_1', ...dto, status: 'DRAFT', userId: 'user_1' };

      prisma.pipeline.create.mockResolvedValue(expectedResult);

      const result = await service.create('user_1', dto);

      expect(prisma.pipeline.create).toHaveBeenCalledWith({
        data: {
          name: dto.name,
          description: dto.description,
          status: 'DRAFT',
          screenshotUrl: null,
          userId: 'user_1',
        },
      });
      expect(result).toEqual(expectedResult);
    });

    it('should create a pipeline with file', async () => {
      const dto = { name: 'Test Pipeline' };
      const mockFile = { filename: 'test.png' } as Express.Multer.File;

      prisma.pipeline.create.mockResolvedValue({ id: 'pipe_1', ...dto });

      await service.create('user_1', dto, mockFile);

      expect(prisma.pipeline.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          screenshotUrl: '/uploads/screenshots/test.png',
        }),
      });
    });

    it('should throw BadRequestException if unique constraint fails (P2002)', async () => {
      prisma.pipeline.create.mockRejectedValue({ code: 'P2002' });

      await expect(service.create('user_1', { name: 'Duplicate' })).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw InternalServerErrorException on unexpected database error', async () => {
      prisma.pipeline.create.mockRejectedValue(new Error('DB Error'));

      await expect(service.create('user_1', { name: 'Pipeline' })).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findAllByUserId', () => {
    it('should return pipelines array ordered by name asc', async () => {
      const mockPipelines = [{ id: 'p1', name: 'A' }, { id: 'p2', name: 'B' }];
      prisma.pipeline.findMany.mockResolvedValue(mockPipelines);

      const result = await service.findAllByUserId('user_1');

      expect(prisma.pipeline.findMany).toHaveBeenCalledWith({
        where: { userId: 'user_1' },
        orderBy: { name: 'asc' },
      });
      expect(result).toEqual(mockPipelines);
    });
  });

  describe('update', () => {
    it('should throw NotFoundException if pipeline does not exist', async () => {
      prisma.pipeline.findUnique.mockResolvedValue(null);

      await expect(service.update('pipe_1', { name: 'Updated' })).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should process screenshotBase64 and write file to disk', async () => {
      const existing = { id: 'pipe_1', screenshotUrl: '/uploads/screenshots/old.png' };
      const dto = {
        name: 'New Name',
        screenshotBase64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      };

      prisma.pipeline.findUnique.mockResolvedValue(existing);
      prisma.pipeline.update.mockResolvedValue({ id: 'pipe_1', name: 'New Name' });

      await service.update('pipe_1', dto);

      expect(fs.unlink).toHaveBeenCalled();
      expect(fs.mkdir).toHaveBeenCalled();
      expect(fs.writeFile).toHaveBeenCalled();
      expect(prisma.pipeline.update).toHaveBeenCalledWith({
        where: { id: 'pipe_1' },
        data: expect.objectContaining({
          name: 'New Name',
          screenshotUrl: expect.stringMatching(/^\/uploads\/screenshots\/.+\.png$/),
        }),
      });
    });
  });

  describe('remove', () => {
    it('should throw NotFoundException if pipeline missing', async () => {
      prisma.pipeline.findUnique.mockResolvedValue(null);

      await expect(service.remove('pipe_1', 'user_1')).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if pipeline belongs to another user', async () => {
      prisma.pipeline.findUnique.mockResolvedValue({ id: 'pipe_1', userId: 'other_user' });

      await expect(service.remove('pipe_1', 'user_1')).rejects.toThrow(ForbiddenException);
    });

    it('should delete screenshot file and pipeline successfully', async () => {
      const pipeline = { id: 'pipe_1', userId: 'user_1', screenshotUrl: '/uploads/screenshots/file.png' };
      prisma.pipeline.findUnique.mockResolvedValue(pipeline);
      prisma.pipeline.delete.mockResolvedValue(pipeline);

      const result = await service.remove('pipe_1', 'user_1');

      expect(fs.unlink).toHaveBeenCalled();
      expect(prisma.pipeline.delete).toHaveBeenCalledWith({ where: { id: 'pipe_1' } });
      expect(result).toEqual(pipeline);
    });
  });
});