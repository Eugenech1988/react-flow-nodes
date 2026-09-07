import { Test, TestingModule } from '@nestjs/testing';
import { PipelinesController } from '@/pipelines/pipelines.controller';
import { PipelinesService } from '@/pipelines/pipelines.service';

describe('PipelinesController', () => {
  let controller: PipelinesController;
  let service: jest.Mocked<PipelinesService>;

  beforeEach(async () => {
    const mockPipelinesService = {
      create: jest.fn(),
      findAllByUserId: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PipelinesController],
      providers: [
        {
          provide: PipelinesService,
          useValue: mockPipelinesService,
        },
      ],
    }).compile();

    controller = module.get<PipelinesController>(PipelinesController);
    service = module.get(PipelinesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call pipelinesService.create', async () => {
      const dto = { name: 'Pipeline 1' };
      const mockFile = { filename: 'screen.png' } as Express.Multer.File;
      service.create.mockResolvedValue({ id: 'p1', ...dto } as any);

      const result = await controller.create('user_1', dto, mockFile);

      expect(service.create).toHaveBeenCalledWith('user_1', dto, mockFile);
      expect(result).toEqual({ id: 'p1', ...dto });
    });
  });

  describe('findAllByUserId', () => {
    it('should call pipelinesService.findAllByUserId', async () => {
      const mockPipelines = [{ id: 'p1' }, { id: 'p2' }];
      service.findAllByUserId.mockResolvedValue(mockPipelines as any);

      const result = await controller.findAllByUserId('user_1');

      expect(service.findAllByUserId).toHaveBeenCalledWith('user_1');
      expect(result).toEqual(mockPipelines);
    });
  });

  describe('update', () => {
    it('should call pipelinesService.update', async () => {
      const dto = { name: 'Updated Name' };
      service.update.mockResolvedValue({ id: 'p1', ...dto } as any);

      const result = await controller.update('p1', dto);

      expect(service.update).toHaveBeenCalledWith('p1', dto, undefined);
      expect(result).toEqual({ id: 'p1', ...dto });
    });
  });

  describe('remove', () => {
    it('should call pipelinesService.remove', async () => {
      service.remove.mockResolvedValue({ id: 'p1' } as any);

      const result = await controller.remove('p1', 'user_1');

      expect(service.remove).toHaveBeenCalledWith('p1', 'user_1');
      expect(result).toEqual({ id: 'p1' });
    });
  });
});