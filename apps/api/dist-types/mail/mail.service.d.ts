import { MailerService } from '@nestjs-modules/mailer';
import type { TSendInquiryInputData, TJobApplicationCreateData } from '@pipeline/contracts';
export declare class MailService {
    private readonly mailerService;
    constructor(mailerService: MailerService);
    sendRecoveryEmail(to: string, link: string): Promise<void>;
    sendInquiryEmail(dto: TSendInquiryInputData): Promise<void>;
    sendApplicationEmail(dto: TJobApplicationCreateData): Promise<void>;
}
