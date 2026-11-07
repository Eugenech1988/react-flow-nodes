import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { TDemoRequestInputData } from '@pipeline/contracts';

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

  async sendDemoRequestEmail(dto: TDemoRequestInputData): Promise<void> {
    const adminEmail = process.env.ADMIN_EMAIL || 'sales@example.com';

    await this.mailerService.sendMail({
      to: adminEmail,
      replyTo: dto.email,
      subject: `New Demo Request from ${dto.name} (${dto.company || 'N/A'})`,
      template: 'demo-request',
      context: {
        name: dto.name,
        email: dto.email,
        company: dto.company || 'Not specified',
        message: dto.message || 'No description provided',
      },
    });
  }
}
