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

type TMockPrisma = {
  pipeline: {
    create: jest.Mock;
    findMany: jest.Mock;
    findUnique: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
  };
};

const createMockPrisma = (): TMockPrisma => ({
  pipeline: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
});

describe('PipelinesService', () => {
  let service: PipelinesService;
  let prisma: TMockPrisma;

  beforeEach(async () => {
    prisma = createMockPrisma();

    const module: TestingModule = await Test.createTestingModule({
      providers: [PipelinesService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<PipelinesService>(PipelinesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
    (fs.unlink as jest.Mock).mockResolvedValue(undefined);
    (fs.mkdir as jest.Mock).mockResolvedValue(undefined);
    (fs.writeFile as jest.Mock).mockResolvedValue(undefined);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('creates a pipeline without file', async () => {
      const dto = { name: 'Test Pipeline', description: 'Desc' };
      const expected = { id: 'pipe_1', ...dto, status: 'DRAFT', userId: 'user_1' };
      prisma.pipeline.create.mockResolvedValue(expected);

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
      expect(result).toEqual(expected);
    });

    it('creates a pipeline with file', async () => {
      const dto = { name: 'Test Pipeline' };
      const file = { filename: 'test.png' } as Express.Multer.File;
      prisma.pipeline.create.mockResolvedValue({ id: 'pipe_1', ...dto });

      await service.create('user_1', dto, file);

      expect(prisma.pipeline.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ screenshotUrl: '/uploads/screenshots/test.png' }),
      });
    });

    it('throws BadRequestException on P2002', async () => {
      prisma.pipeline.create.mockRejectedValue({ code: 'P2002' });

      await expect(service.create('user_1', { name: 'Dup' })).rejects.toThrow(BadRequestException);
    });

    it('throws InternalServerErrorException on unexpected error', async () => {
      prisma.pipeline.create.mockRejectedValue(new Error('DB'));

      await expect(service.create('user_1', { name: 'P' })).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findAllByUserId', () => {
    it('returns pipelines ordered by name asc', async () => {
      const pipelines = [
        { id: 'p1', name: 'A' },
        { id: 'p2', name: 'B' },
      ];
      prisma.pipeline.findMany.mockResolvedValue(pipelines);

      const result = await service.findAllByUserId('user_1');

      expect(prisma.pipeline.findMany).toHaveBeenCalledWith({
        where: { userId: 'user_1' },
        orderBy: { name: 'asc' },
      });
      expect(result).toEqual(pipelines);
    });
  });

  describe('deleteFile', () => {
    const getDeleteFile = () =>
      (
        service as unknown as { deleteFile: (relativePath: string | null) => Promise<void> }
      ).deleteFile.bind(service);

    it('returns early when relativePath is null', async () => {
      await getDeleteFile()(null);

      expect(fs.unlink).not.toHaveBeenCalled();
    });

    it('deletes the file when path is provided', async () => {
      await getDeleteFile()('/uploads/screenshots/file.png');

      expect(fs.unlink).toHaveBeenCalledWith(
        expect.stringContaining('/uploads/screenshots/file.png'),
      );
    });
  });

  describe('update', () => {
    it('throws NotFoundException when pipeline is missing', async () => {
      prisma.pipeline.findUnique.mockResolvedValue(null);

      await expect(service.update('pipe_1', 'user_1', { name: 'X' })).rejects.toThrow(
        NotFoundException,
      );
    });

    it('throws ForbiddenException when user is not owner', async () => {
      prisma.pipeline.findUnique.mockResolvedValue({ id: 'pipe_1', userId: 'other' });

      await expect(service.update('pipe_1', 'user_1', { name: 'X' })).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('writes base64 screenshot and updates pipeline', async () => {
      prisma.pipeline.findUnique.mockResolvedValue({
        id: 'pipe_1',
        userId: 'user_1',
        screenshotUrl: '/uploads/screenshots/old.png',
      });
      prisma.pipeline.update.mockResolvedValue({ id: 'pipe_1', name: 'New' });

      await service.update('pipe_1', 'user_1', {
        name: 'New',
        screenshotBase64: 'data:image/png;base64,iVBORw0KGgo=',
      });

      expect(fs.unlink).toHaveBeenCalled();
      expect(fs.mkdir).toHaveBeenCalled();
      expect(fs.writeFile).toHaveBeenCalled();
      expect(prisma.pipeline.update).toHaveBeenCalledWith({
        where: { id: 'pipe_1' },
        data: expect.objectContaining({
          name: 'New',
          screenshotUrl: expect.stringMatching(/^\/uploads\/screenshots\/.+\.png$/),
        }),
      });
    });

    it('uses uploaded file when base64 absent', async () => {
      prisma.pipeline.findUnique.mockResolvedValue({
        id: 'pipe_1',
        userId: 'user_1',
        screenshotUrl: null,
      });
      prisma.pipeline.update.mockResolvedValue({ id: 'pipe_1' });
      const file = { filename: 'uploaded.png' } as Express.Multer.File;

      await service.update('pipe_1', 'user_1', {}, file);

      expect(fs.writeFile).not.toHaveBeenCalled();
      expect(prisma.pipeline.update).toHaveBeenCalledWith({
        where: { id: 'pipe_1' },
        data: expect.objectContaining({ screenshotUrl: '/uploads/screenshots/uploaded.png' }),
      });
    });

    it('passes graphData through', async () => {
      prisma.pipeline.findUnique.mockResolvedValue({
        id: 'pipe_1',
        userId: 'user_1',
        screenshotUrl: null,
      });
      prisma.pipeline.update.mockResolvedValue({ id: 'pipe_1' });
      const graphData = { nodes: [], edges: [] };

      await service.update('pipe_1', 'user_1', { graphData });

      expect(prisma.pipeline.update).toHaveBeenCalledWith({
        where: { id: 'pipe_1' },
        data: expect.objectContaining({ graphData }),
      });
    });

    it('throws BadRequestException on P2002 during update', async () => {
      prisma.pipeline.findUnique.mockResolvedValue({
        id: 'pipe_1',
        userId: 'user_1',
        screenshotUrl: null,
      });
      prisma.pipeline.update.mockRejectedValue({ code: 'P2002' });

      await expect(service.update('pipe_1', 'user_1', { name: 'X' })).rejects.toThrow(
        BadRequestException,
      );
    });

    it('rolls back uploaded screenshot on update failure', async () => {
      prisma.pipeline.findUnique.mockResolvedValue({
        id: 'pipe_1',
        userId: 'user_1',
        screenshotUrl: null,
      });
      prisma.pipeline.update.mockRejectedValue(new Error('DB'));

      await expect(
        service.update('pipe_1', 'user_1', {
          screenshotBase64: 'data:image/png;base64,iVBORw0KGgo=',
        }),
      ).rejects.toThrow(InternalServerErrorException);

      expect(fs.unlink).toHaveBeenCalledTimes(1);
    });

    it('throws InternalServerErrorException on unexpected update error', async () => {
      prisma.pipeline.findUnique.mockResolvedValue({
        id: 'pipe_1',
        userId: 'user_1',
        screenshotUrl: null,
      });
      prisma.pipeline.update.mockRejectedValue(new Error('DB'));

      await expect(service.update('pipe_1', 'user_1', { name: 'X' })).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('remove', () => {
    it('throws NotFoundException when pipeline is missing', async () => {
      prisma.pipeline.findUnique.mockResolvedValue(null);

      await expect(service.remove('pipe_1', 'user_1')).rejects.toThrow(NotFoundException);
    });

    it('throws ForbiddenException when user is not owner', async () => {
      prisma.pipeline.findUnique.mockResolvedValue({ id: 'pipe_1', userId: 'other' });

      await expect(service.remove('pipe_1', 'user_1')).rejects.toThrow(ForbiddenException);
    });

    it('deletes screenshot file and pipeline', async () => {
      const pipeline = {
        id: 'pipe_1',
        userId: 'user_1',
        screenshotUrl: '/uploads/screenshots/file.png',
      };
      prisma.pipeline.findUnique.mockResolvedValue(pipeline);
      prisma.pipeline.delete.mockResolvedValue(pipeline);

      const result = await service.remove('pipe_1', 'user_1');

      expect(fs.unlink).toHaveBeenCalled();
      expect(prisma.pipeline.delete).toHaveBeenCalledWith({ where: { id: 'pipe_1' } });
      expect(result).toEqual(pipeline);
    });

    it('skips file deletion when screenshotUrl is null', async () => {
      const pipeline = { id: 'pipe_1', userId: 'user_1', screenshotUrl: null };
      prisma.pipeline.findUnique.mockResolvedValue(pipeline);
      prisma.pipeline.delete.mockResolvedValue(pipeline);

      await service.remove('pipe_1', 'user_1');

      expect(fs.unlink).not.toHaveBeenCalled();
    });

    it('swallows unlink errors', async () => {
      const pipeline = {
        id: 'pipe_1',
        userId: 'user_1',
        screenshotUrl: '/uploads/screenshots/file.png',
      };
      prisma.pipeline.findUnique.mockResolvedValue(pipeline);
      prisma.pipeline.delete.mockResolvedValue(pipeline);
      (fs.unlink as jest.Mock).mockRejectedValueOnce(new Error('ENOENT'));

      await expect(service.remove('pipe_1', 'user_1')).resolves.toEqual(pipeline);
    });

    it('wraps DB errors as InternalServerErrorException', async () => {
      const pipeline = { id: 'pipe_1', userId: 'user_1', screenshotUrl: null };
      prisma.pipeline.findUnique.mockResolvedValue(pipeline);
      prisma.pipeline.delete.mockRejectedValue(new Error('DB'));

      await expect(service.remove('pipe_1', 'user_1')).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
