import { Test, TestingModule } from '@nestjs/testing';
import { JobsController } from '../jobs.controller';
import { JobsService } from '../jobs.service';

const mockJobsService = {
  findAll: jest.fn(),
  findOneBySlug: jest.fn(),
};

describe('JobsController', () => {
  let controller: JobsController;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobsController],
      providers: [{ provide: JobsService, useValue: mockJobsService }],
    }).compile();

    controller = module.get<JobsController>(JobsController);
  });

  describe('findAll', () => {
    it('delegates to jobsService.findAll with locale and department', async () => {
      const jobs = [{ id: 'job-1', slug: 'senior-frontend' }];
      mockJobsService.findAll.mockResolvedValue(jobs);

      const result = await controller.findAll('ua', 'ENGINEERING');

      expect(mockJobsService.findAll).toHaveBeenCalledWith({
        locale: 'ua',
        department: 'ENGINEERING',
      });
      expect(result).toEqual(jobs);
    });

    it('passes undefined when query params are missing', async () => {
      mockJobsService.findAll.mockResolvedValue([]);

      await controller.findAll(undefined, undefined);

      expect(mockJobsService.findAll).toHaveBeenCalledWith({
        locale: undefined,
        department: undefined,
      });
    });
  });

  describe('findOne', () => {
    it('delegates to jobsService.findOneBySlug', async () => {
      const job = { id: 'job-1', slug: 'senior-frontend' };
      mockJobsService.findOneBySlug.mockResolvedValue(job);

      const result = await controller.findOne('senior-frontend', 'ua');

      expect(mockJobsService.findOneBySlug).toHaveBeenCalledWith('senior-frontend', 'ua');
      expect(result).toEqual(job);
    });

    it('propagates errors from service', async () => {
      mockJobsService.findOneBySlug.mockRejectedValue(new Error('Not found'));

      await expect(controller.findOne('missing', 'en')).rejects.toThrow('Not found');
    });
  });
});
