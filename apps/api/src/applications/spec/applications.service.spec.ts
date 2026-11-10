import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationsService } from '../applications.service';
import { PrismaService } from '@/prisma/prisma.service';
import { MailService } from '@/mail/mail.service';
import type { TJobApplicationCreateData } from '@pipeline/contracts';

describe('ApplicationsService', () => {
  let service: ApplicationsService;
  let prisma: jest.Mocked<PrismaService>;
  let mailService: jest.Mocked<MailService>;

  const mockApplicationData: TJobApplicationCreateData = {
    jobId: 'job_123',
    name: 'John Doe',
    email: 'john@example.com',
    company: 'Acme Corp',
    position: 'Engineer',
    message: 'Hello',
    resumeUrl: 'http://localhost:3000/uploads/cv.pdf',
    coverLetterUrl: 'http://localhost:3000/uploads/cover.pdf',
  };

  beforeEach(async () => {
    const mockPrisma = {
      jobApplication: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        delete: jest.fn(),
      },
      job: {
        update: jest.fn(),
      },
    };

    const mockMailService = {
      sendApplicationEmail: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApplicationsService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: MailService, useValue: mockMailService },
      ],
    }).compile();

    service = module.get<ApplicationsService>(ApplicationsService);
    prisma = module.get(PrismaService) as jest.Mocked<PrismaService>;
    mailService = module.get(MailService) as jest.Mocked<MailService>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an application, increment counter, and send email', async () => {
      // 👇 Теперь TS знает, что это мок
      (prisma.jobApplication.create as jest.Mock).mockResolvedValue({
        id: 'app_123',
        ...mockApplicationData,
      });
      (prisma.job.update as jest.Mock).mockResolvedValue({});
      (mailService.sendApplicationEmail as jest.Mock).mockResolvedValue(undefined);

      const result = await service.create(mockApplicationData);

      expect(prisma.jobApplication.create).toHaveBeenCalledWith({
        data: mockApplicationData,
      });

      expect(prisma.job.update).toHaveBeenCalledWith({
        where: { id: mockApplicationData.jobId },
        data: { applications: { increment: 1 } },
      });

      expect(mailService.sendApplicationEmail).toHaveBeenCalledWith(mockApplicationData);
      expect(result).toEqual({ id: 'app_123', ...mockApplicationData });
    });
  });

  describe('findAll', () => {
    it('should return all applications with job translations', async () => {
      const mockApps = [{ id: 'app_1' }, { id: 'app_2' }];
      (prisma.jobApplication.findMany as jest.Mock).mockResolvedValue(mockApps);

      const result = await service.findAll();

      expect(prisma.jobApplication.findMany).toHaveBeenCalledWith({
        where: {},
        include: {
          job: {
            include: { translations: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual(mockApps);
    });

    it('should filter by jobId if provided', async () => {
      (prisma.jobApplication.findMany as jest.Mock).mockResolvedValue([]);

      await service.findAll({ jobId: 'job_123' });

      expect(prisma.jobApplication.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { jobId: 'job_123' },
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should return an application by id', async () => {
      const mockApp = { id: 'app_1', job: { translations: [] } };
      (prisma.jobApplication.findUnique as jest.Mock).mockResolvedValue(mockApp);

      const result = await service.findOne('app_1');

      expect(prisma.jobApplication.findUnique).toHaveBeenCalledWith({
        where: { id: 'app_1' },
        include: {
          job: {
            include: { translations: true },
          },
        },
      });
      expect(result).toEqual(mockApp);
    });

    it('should throw NotFoundException if application not found', async () => {
      (prisma.jobApplication.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.findOne('invalid')).rejects.toThrow(
        'Application with ID "invalid" not found',
      );
    });
  });

  describe('remove', () => {
    it('should delete an application', async () => {
      (prisma.jobApplication.findUnique as jest.Mock).mockResolvedValue({ id: 'app_1' });
      (prisma.jobApplication.delete as jest.Mock).mockResolvedValue({ id: 'app_1' });

      const result = await service.remove('app_1');

      expect(prisma.jobApplication.delete).toHaveBeenCalledWith({ where: { id: 'app_1' } });
      expect(result).toEqual({ id: 'app_1' });
    });
  });
});
