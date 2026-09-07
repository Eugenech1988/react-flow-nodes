import { Test, TestingModule } from '@nestjs/testing';
import { MailerService } from '@nestjs-modules/mailer';
import { MailService } from '@/mail/mail.service';

describe('MailService', () => {
  let service: MailService;
  let mailerService: jest.Mocked<MailerService>;

  beforeEach(async () => {
    const mockMailerService = {
      sendMail: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailService,
        {
          provide: MailerService,
          useValue: mockMailerService,
        },
      ],
    }).compile();

    service = module.get<MailService>(MailService);
    mailerService = module.get(MailerService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendRecoveryEmail', () => {
    it('should send recovery email with correct params', async () => {
      const email = 'user@example.com';
      const link = 'https://example.com/reset-password?token=abc';

      mailerService.sendMail.mockResolvedValue({} as any);

      await service.sendRecoveryEmail(email, link);

      expect(mailerService.sendMail).toHaveBeenCalledTimes(1);
      expect(mailerService.sendMail).toHaveBeenCalledWith({
        to: email,
        subject: 'Password Recovery',
        template: 'recovery',
        context: {
          link,
        },
      });
    });

    it('should propagate errors if sendMail fails', async () => {
      const email = 'user@example.com';
      const link = 'https://example.com/reset';
      const mockError = new Error('SMTP connection error');

      mailerService.sendMail.mockRejectedValue(mockError);

      await expect(service.sendRecoveryEmail(email, link)).rejects.toThrow(
        'SMTP connection error',
      );
    });
  });
});