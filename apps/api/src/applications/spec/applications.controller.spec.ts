import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import type { JobApplication } from '@prisma/client';
import { ApplicationsController } from '../applications.controller';
import { ApplicationsService } from '../applications.service';

const createMockApplication = (overrides: Partial<JobApplication> = {}): JobApplication => ({
  id: 'app_123',
  jobId: 'job_123',
  name: 'John Doe',
  email: 'john@example.com',
  company: 'Acme Corp',
  position: 'Engineer',
  message: 'Hello',
  resumeUrl: 'http://localhost:3000/uploads/resume.pdf',
  coverLetterUrl: null,
  createdAt: new Date(),
  ...overrides,
});

describe('ApplicationsController', () => {
  let controller: ApplicationsController;
  let service: jest.Mocked<ApplicationsService>;

  const mockBody = {
    jobId: 'job_123',
    name: 'John Doe',
    email: 'john@example.com',
    company: 'Acme Corp',
    position: 'Engineer',
    message: 'Hello',
  };

  const mockResumeFile = {
    fieldname: 'resume',
    originalname: 'resume.pdf',
    filename: 'resume-123.pdf',
  } as Express.Multer.File;

  const mockCoverFile = {
    fieldname: 'coverLetterFile',
    originalname: 'cover.pdf',
    filename: 'cover-123.pdf',
  } as Express.Multer.File;

  beforeEach(async () => {
    const mockService = {
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApplicationsController],
      providers: [{ provide: ApplicationsService, useValue: mockService }],
    }).compile();

    controller = module.get<ApplicationsController>(ApplicationsController);
    service = module.get(ApplicationsService) as jest.Mocked<ApplicationsService>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should successfully create an application with resume and cover letter', async () => {
      const expectedUrl = 'http://localhost:3000/uploads/applications/job_123';
      const mockResult = createMockApplication({
        resumeUrl: `${expectedUrl}/cvs/resume-123.pdf`,
        coverLetterUrl: `${expectedUrl}/covers/cover-123.pdf`,
      });
      service.create.mockResolvedValue(mockResult);

      const result = await controller.create(mockBody, {
        resume: [mockResumeFile],
        coverLetterFile: [mockCoverFile],
      });

      expect(service.create).toHaveBeenCalledWith({
        ...mockBody,
        resumeUrl: `${expectedUrl}/cvs/resume-123.pdf`,
        coverLetterUrl: `${expectedUrl}/covers/cover-123.pdf`,
      });
      expect(result).toEqual(mockResult);
    });

    it('should successfully create an application with only a resume', async () => {
      const expectedUrl = 'http://localhost:3000/uploads/applications/job_123';
      const mockResult = createMockApplication({
        resumeUrl: `${expectedUrl}/cvs/resume-123.pdf`,
      });
      service.create.mockResolvedValue(mockResult);

      await controller.create(mockBody, {
        resume: [mockResumeFile],
      });

      expect(service.create).toHaveBeenCalledWith({
        ...mockBody,
        resumeUrl: `${expectedUrl}/cvs/resume-123.pdf`,
        coverLetterUrl: undefined,
      });
    });

    it('should throw BadRequestException if resume is missing', async () => {
      await expect(
        controller.create(mockBody, { coverLetterFile: [mockCoverFile] }),
      ).rejects.toThrow(new BadRequestException('Resume is required'));
    });

    it('should throw BadRequestException if body validation fails', async () => {
      const invalidBody = { ...mockBody, email: 'invalid-email' };

      await expect(controller.create(invalidBody, { resume: [mockResumeFile] })).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
