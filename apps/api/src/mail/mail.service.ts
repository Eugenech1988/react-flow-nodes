import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendRecoveryEmail(to: string, link: string): Promise<void> {
    await this.mailerService.sendMail({
      to,
      subject: 'Password Recovery',
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>Password Recovery</h2>
          <p>You requested a password reset. Click the link below to set a new password:</p>
          <a href="${link}" style="display: inline-block; padding: 10px 20px; background-color: #0070f3; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
          <p style="margin-top: 20px; color: #666;">This link will expire in 15 minutes.</p>
        </div>
      `,
    });
  }
}