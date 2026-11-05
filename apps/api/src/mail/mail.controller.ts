import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { demoRequestInputSchema, TDemoRequestInputData } from '@pipeline/contracts';
import { MailService } from '@/mail/mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('request-demo')
  async requestDemo(@Body() body: unknown) {
    const result = demoRequestInputSchema.safeParse(body);

    if (!result.success) {
      throw new BadRequestException(result.error.issues);
    }

    const dto: TDemoRequestInputData = result.data;

    await this.mailService.sendDemoRequestEmail(dto);
    return { success: true };
  }
}
