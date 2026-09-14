import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionsController } from '@/executions/executions.controller';
import { ExecutionsService } from '@/executions/executions.service';
import type { TCreateExecutionInputData } from '@pipeline/contracts';

const mockExecutionResponse = {
  id: 'exec_123',
  pipelineId: 'pipe_123',
  userId: 'user_123',
  status: 'RUNNING' as const,
  triggeredBy: 'MANUAL' as const,
  durationFormatted: null,
};

const mockExecutionsService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('ExecutionsController', () => {
  let controller: ExecutionsController;
  let service: typeof mockExecutionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExecutionsController],
      providers: [
        {
          provide: ExecutionsService,
          useValue: mockExecutionsService,
        },
      ],
    }).compile();

    controller = module.get<ExecutionsController>(ExecutionsController);
    service = module.get(ExecutionsService);

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should call service.create with full valid dto', async () => {
      const dto: TCreateExecutionInputData = {
        pipelineId: 'pipe_123',
        userId: 'user_123',
        status: 'RUNNING',
        triggeredBy: 'MANUAL',
        nodesExecuted: 0,
      };

      service.create.mockResolvedValue(mockExecutionResponse);

      const result = await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockExecutionResponse);
    });
  });

  describe('findAll', () => {
    it('should call service.findAll with query params', async () => {
      service.findAll.mockResolvedValue([mockExecutionResponse]);

      const result = await controller.findAll('user_123', 'pipe_123');

      expect(service.findAll).toHaveBeenCalledWith('user_123', 'pipe_123');
      expect(result).toEqual([mockExecutionResponse]);
    });
  });

  describe('findOne', () => {
    it('should call service.findOne with id string', async () => {
      service.findOne.mockResolvedValue(mockExecutionResponse);

      const result = await controller.findOne('exec_123');

      expect(service.findOne).toHaveBeenCalledWith('exec_123');
      expect(result).toEqual(mockExecutionResponse);
    });
  });

  describe('update', () => {
    it('should call service.update with string id and partial dto', async () => {
      const dto = { status: 'SUCCESS' as const };
      service.update.mockResolvedValue({ ...mockExecutionResponse, status: 'SUCCESS' });

      const result = await controller.update('exec_123', dto);

      expect(service.update).toHaveBeenCalledWith('exec_123', dto);
      expect(result.status).toBe('SUCCESS');
    });
  });

  describe('remove', () => {
    it('should call service.remove with id string', async () => {
      service.remove.mockResolvedValue(mockExecutionResponse);

      await controller.remove('exec_123');

      expect(service.remove).toHaveBeenCalledWith('exec_123');
    });
  });
});