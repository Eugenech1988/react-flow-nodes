import { router, publicProcedure } from '@/trpc/init';
import { sendInquiryInputSchema } from '@pipeline/contracts';
import type { MailService } from '@/mail/mail.service';

export function createMailRouter(mailService: MailService) {
  return router({
    sendInquiry: publicProcedure.input(sendInquiryInputSchema).mutation(async ({ input }) => {
      await mailService.sendInquiryEmail(input);
      return { success: true };
    }),
  });
}
