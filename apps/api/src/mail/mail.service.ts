import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import type {
  TSendInquiryInputData,
  TInquiryTypeData,
  TJobApplicationCreateData,
} from '@pipeline/contracts';

const INQUIRY_SUBJECTS: Record<TInquiryTypeData, string> = {
  demo: 'New Demo Request',
  contact: 'New Contact Message',
  review: 'New Review Entry',
  glitch: 'New Glitch Report',
};

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendRecoveryEmail(to: string, link: string): Promise<void> {
    await this.mailerService.sendMail({
      to,
      subject: 'Password Recovery',
      template: 'recovery',
      context: { link },
    });
  }

  async sendInquiryEmail(dto: TSendInquiryInputData): Promise<void> {
    const adminEmail = process.env.ADMIN_EMAIL || 'sales@example.com';
    const subjectText = INQUIRY_SUBJECTS[dto.type];

    await this.mailerService.sendMail({
      to: adminEmail,
      replyTo: dto.email,
      subject: `${subjectText} from ${dto.name} (${dto.company})`,
      template: 'request',
      context: {
        title: subjectText,
        name: dto.name,
        email: dto.email,
        company: dto.company,
        position: dto.position,
        message: dto.message,
        type: dto.type,
      },
    });
  }

  async sendApplicationEmail(dto: TJobApplicationCreateData): Promise<void> {
    const adminEmail = process.env.ADMIN_EMAIL || 'careers@example.com';

    await this.mailerService.sendMail({
      to: adminEmail,
      replyTo: dto.email,
      subject: `New Application: ${dto.position} - ${dto.name}`,
      template: 'application',
      context: {
        name: dto.name,
        email: dto.email,
        company: dto.company,
        position: dto.position,
        message: dto.message || 'No cover letter provided',
        resumeUrl: dto.resumeUrl,
        coverLetterUrl: dto.coverLetterUrl,
      },
    });
  }
}
