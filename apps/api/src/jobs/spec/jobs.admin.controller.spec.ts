import { Test, TestingModule } from '@nestjs/testing';
import { AdminJobsController } from '../jobs.admin.controller';
import { JobsService } from '../jobs.service';
import type { TUserSafe } from '@/auth/types/auth.types';

const mockJobsService = {
  findAllAdmin: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  publish: jest.fn(),
  archive: jest.fn(),
  remove: jest.fn(),
  upsertTranslation: jest.fn(),
  removeTranslation: jest.fn(),
};

const mockUser = { id: 'user-1', email: 'admin@example.com', role: 'SUPER_ADMIN' } as TUserSafe;

describe('AdminJobsController', () => {
  let controller: AdminJobsController;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminJobsController],
      providers: [{ provide: JobsService, useValue: mockJobsService }],
    }).compile();

    controller = module.get<AdminJobsController>(AdminJobsController);
  });

  describe('findAll', () => {
    it('delegates to jobsService.findAllAdmin', async () => {
      const jobs = [{ id: 'job-1' }];
      mockJobsService.findAllAdmin.mockResolvedValue(jobs);

      const result = await controller.findAll();

      expect(mockJobsService.findAllAdmin).toHaveBeenCalled();
      expect(result).toEqual(jobs);
    });
  });

  describe('findOne', () => {
    it('delegates to jobsService.findOne with id', async () => {
      const job = { id: 'job-1', slug: 'senior-frontend' };
      mockJobsService.findOne.mockResolvedValue(job);

      const result = await controller.findOne('job-1');

      expect(mockJobsService.findOne).toHaveBeenCalledWith('job-1');
      expect(result).toEqual(job);
    });
  });

  describe('create', () => {
    it('delegates to jobsService.create with dto and user.id', async () => {
      const dto = {
        slug: 'new-job',
        department: 'ENGINEERING',
        level: 'MID',
        type: 'FULL_TIME',
        location: 'Remote',
        status: 'PUBLISHED',
        translations: [],
      } as any;
      const created = { id: 'job-2', slug: 'new-job' };
      mockJobsService.create.mockResolvedValue(created);

      const result = await controller.create(dto, mockUser);

      expect(mockJobsService.create).toHaveBeenCalledWith(dto, 'user-1');
      expect(result).toEqual(created);
    });
  });

  describe('update', () => {
    it('delegates to jobsService.update', async () => {
      const dto = { location: 'London' } as any;
      const updated = { id: 'job-1', location: 'London' };
      mockJobsService.update.mockResolvedValue(updated);

      const result = await controller.update('job-1', dto);

      expect(mockJobsService.update).toHaveBeenCalledWith('job-1', dto);
      expect(result).toEqual(updated);
    });
  });

  describe('publish', () => {
    it('delegates to jobsService.publish', async () => {
      const updated = { id: 'job-1', status: 'PUBLISHED' };
      mockJobsService.publish.mockResolvedValue(updated);

      const result = await controller.publish('job-1');

      expect(mockJobsService.publish).toHaveBeenCalledWith('job-1');
      expect(result).toEqual(updated);
    });
  });

  describe('archive', () => {
    it('delegates to jobsService.archive', async () => {
      const updated = { id: 'job-1', status: 'ARCHIVED' };
      mockJobsService.archive.mockResolvedValue(updated);

      const result = await controller.archive('job-1');

      expect(mockJobsService.archive).toHaveBeenCalledWith('job-1');
      expect(result).toEqual(updated);
    });
  });

  describe('remove', () => {
    it('delegates to jobsService.remove', async () => {
      mockJobsService.remove.mockResolvedValue({ id: 'job-1' });

      await controller.remove('job-1');

      expect(mockJobsService.remove).toHaveBeenCalledWith('job-1');
    });
  });

  describe('upsertTranslation', () => {
    it('merges locale from URL into dto', async () => {
      const dto = {
        title: 'Заголовок',
        description: 'Опис',
        responsibilities: [],
        requirements: [],
        metaTitle: null,
        metaDescription: null,
      } as any;
      mockJobsService.upsertTranslation.mockResolvedValue({ id: 'tr-ua' });

      await controller.upsertTranslation('job-1', 'ua', dto);

      expect(mockJobsService.upsertTranslation).toHaveBeenCalledWith('job-1', {
        ...dto,
        locale: 'ua',
      });
    });
  });

  describe('removeTranslation', () => {
    it('delegates to jobsService.removeTranslation', async () => {
      mockJobsService.removeTranslation.mockResolvedValue({});

      await controller.removeTranslation('job-1', 'ua');

      expect(mockJobsService.removeTranslation).toHaveBeenCalledWith('job-1', 'ua');
    });
  });
});
