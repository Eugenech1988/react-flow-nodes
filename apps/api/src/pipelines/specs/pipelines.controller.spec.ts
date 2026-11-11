import { Test, TestingModule } from '@nestjs/testing';
import { PipelinesController } from '@/pipelines/pipelines.controller';
import { PipelinesService } from '@/pipelines/pipelines.service';

type TCreated = Awaited<ReturnType<PipelinesService['create']>>;
type TListed = Awaited<ReturnType<PipelinesService['findAllByUserId']>>;
type TUpdated = Awaited<ReturnType<PipelinesService['update']>>;
type TRemoved = Awaited<ReturnType<PipelinesService['remove']>>;
type TMockPipelinesService = jest.Mocked<
  Pick<PipelinesService, 'create' | 'findAllByUserId' | 'update' | 'remove'>
>;

const createMockPipelinesService = (): TMockPipelinesService => ({
  create: jest.fn(),
  findAllByUserId: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
});

describe('PipelinesController', () => {
  let controller: PipelinesController;
  let service: TMockPipelinesService;

  beforeEach(async () => {
    service = createMockPipelinesService();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PipelinesController],
      providers: [{ provide: PipelinesService, useValue: service }],
    }).compile();

    controller = module.get<PipelinesController>(PipelinesController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('delegates to create with userId from JWT', async () => {
      const dto = { name: 'Pipeline 1' };
      const file = { filename: 'screen.png' } as Express.Multer.File;
      const created = { id: 'p1', ...dto } as TCreated;
      service.create.mockResolvedValue(created);

      const result = await controller.create('user_1', dto, file);

      expect(service.create).toHaveBeenCalledWith('user_1', dto, file);
      expect(result).toEqual(created);
    });
  });

  describe('findAllByUserId', () => {
    it('delegates to findAllByUserId with userId from JWT', async () => {
      const pipelines = [{ id: 'p1' }, { id: 'p2' }] as TListed;
      service.findAllByUserId.mockResolvedValue(pipelines);

      const result = await controller.findAllByUserId('user_1');

      expect(service.findAllByUserId).toHaveBeenCalledWith('user_1');
      expect(result).toEqual(pipelines);
    });
  });

  describe('update', () => {
    it('delegates to update with id, userId, dto and file', async () => {
      const dto = { name: 'Updated Name' };
      const updated = { id: 'p1', ...dto } as TUpdated;
      service.update.mockResolvedValue(updated);

      const result = await controller.update('p1', 'user_1', dto, undefined);

      expect(service.update).toHaveBeenCalledWith('p1', 'user_1', dto, undefined);
      expect(result).toEqual(updated);
    });
  });

  describe('remove', () => {
    it('delegates to remove with id and userId', async () => {
      const removed = { id: 'p1' } as TRemoved;
      service.remove.mockResolvedValue(removed);

      const result = await controller.remove('p1', 'user_1');

      expect(service.remove).toHaveBeenCalledWith('p1', 'user_1');
      expect(result).toEqual(removed);
    });
  });
});
