import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendRecoveryEmail(to: string, link: string): Promise<void> {
    await this.mailerService.sendMail({
      to,
      subject: 'Password Recovery',
      template: 'recovery',
      context: {
        link,
      },
    });
  }
}