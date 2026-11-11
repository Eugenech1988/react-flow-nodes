import { Test, TestingModule } from '@nestjs/testing';
import { MailerService } from '@nestjs-modules/mailer';
import { MailService } from '@/mail/mail.service';
import type { TSendInquiryInputData, TJobApplicationCreateData } from '@pipeline/contracts';

describe('MailService', () => {
  let service: MailService;
  let mailerService: jest.Mocked<Pick<MailerService, 'sendMail'>>;

  const ORIGINAL_ADMIN_EMAIL = process.env.ADMIN_EMAIL;

  beforeEach(async () => {
    const mockMailerService: jest.Mocked<Pick<MailerService, 'sendMail'>> = {
      sendMail: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [MailService, { provide: MailerService, useValue: mockMailerService }],
    }).compile();

    service = module.get<MailService>(MailService);
    mailerService = module.get(MailerService);

    mailerService.sendMail.mockResolvedValue({});
  });

  afterEach(() => {
    jest.clearAllMocks();
    if (ORIGINAL_ADMIN_EMAIL === undefined) delete process.env.ADMIN_EMAIL;
    else process.env.ADMIN_EMAIL = ORIGINAL_ADMIN_EMAIL;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendRecoveryEmail', () => {
    it('sends recovery email with the correct params', async () => {
      await service.sendRecoveryEmail('user@example.com', 'https://example.com/reset?t=abc');

      expect(mailerService.sendMail).toHaveBeenCalledWith({
        to: 'user@example.com',
        subject: 'Password Recovery',
        template: 'recovery',
        context: { link: 'https://example.com/reset?t=abc' },
      });
    });

    it('propagates sendMail errors', async () => {
      mailerService.sendMail.mockRejectedValueOnce(new Error('SMTP connection error'));

      await expect(
        service.sendRecoveryEmail('user@example.com', 'https://example.com/reset'),
      ).rejects.toThrow('SMTP connection error');
    });
  });

  describe('sendInquiryEmail', () => {
    const baseInquiry: TSendInquiryInputData = {
      type: 'demo',
      email: 'jane@example.com',
      name: 'Jane Doe',
      company: 'Acme',
      position: 'CTO',
      message: 'Interested in a demo',
    };

    it('uses ADMIN_EMAIL when set', async () => {
      process.env.ADMIN_EMAIL = 'ops@example.com';

      await service.sendInquiryEmail(baseInquiry);

      expect(mailerService.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({ to: 'ops@example.com', replyTo: 'jane@example.com' }),
      );
    });

    it('falls back to sales@example.com when ADMIN_EMAIL is unset', async () => {
      delete process.env.ADMIN_EMAIL;

      await service.sendInquiryEmail(baseInquiry);

      expect(mailerService.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({ to: 'sales@example.com' }),
      );
    });

    it.each([
      ['contact', 'New Contact Message'],
      ['review', 'New Review Entry'],
      ['glitch', 'New Glitch Report'],
    ] as const)('maps type "%s" to subject "%s"', async (type, subject) => {
      await service.sendInquiryEmail({ ...baseInquiry, type });

      expect(mailerService.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          subject: `${subject} from Jane Doe (Acme)`,
          context: expect.objectContaining({ title: subject, type }),
        }),
      );
    });

    it('propagates sendMail errors', async () => {
      mailerService.sendMail.mockRejectedValueOnce(new Error('SMTP down'));

      await expect(service.sendInquiryEmail(baseInquiry)).rejects.toThrow('SMTP down');
    });
  });

  describe('sendApplicationEmail', () => {
    const baseApplication: TJobApplicationCreateData = {
      jobId: 'job-1',
      name: 'John Smith',
      email: 'john@example.com',
      company: 'Initech',
      position: 'Backend Engineer',
      message: 'I would love to join.',
      resumeUrl: 'https://files.example.com/cv.pdf',
      coverLetterUrl: 'https://files.example.com/cover.pdf',
    };

    it('uses ADMIN_EMAIL when set', async () => {
      process.env.ADMIN_EMAIL = 'careers@company.io';

      await service.sendApplicationEmail(baseApplication);

      expect(mailerService.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'careers@company.io',
          replyTo: 'john@example.com',
          subject: 'New Application: Backend Engineer - John Smith',
        }),
      );
    });

    it('falls back to careers@example.com when ADMIN_EMAIL is unset', async () => {
      delete process.env.ADMIN_EMAIL;

      await service.sendApplicationEmail(baseApplication);

      expect(mailerService.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({ to: 'careers@example.com' }),
      );
    });

    it('substitutes a fallback for an empty message', async () => {
      await service.sendApplicationEmail({ ...baseApplication, message: '' });

      const call = mailerService.sendMail.mock.calls[0][0];
      expect(call.context).toMatchObject({ message: 'No cover letter provided' });
    });

    it('passes through resumeUrl and coverLetterUrl', async () => {
      await service.sendApplicationEmail(baseApplication);

      const call = mailerService.sendMail.mock.calls[0][0];
      expect(call.context).toMatchObject({
        resumeUrl: 'https://files.example.com/cv.pdf',
        coverLetterUrl: 'https://files.example.com/cover.pdf',
      });
    });

    it('propagates sendMail errors', async () => {
      mailerService.sendMail.mockRejectedValueOnce(new Error('SMTP down'));

      await expect(service.sendApplicationEmail(baseApplication)).rejects.toThrow('SMTP down');
    });
  });
});
