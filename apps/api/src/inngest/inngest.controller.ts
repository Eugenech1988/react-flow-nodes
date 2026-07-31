import { Controller, All, Req, Res } from '@nestjs/common';
import { serve } from 'inngest/express';
import { inngest, functions } from './inngest.client';

@Controller('api/inngest')
export class InngestController {
  private handler = serve({
    client: inngest,
    functions,
  });

  @All()
  async handleInngest(@Req() req: any, @Res() res: any) {
    return this.handler(req, res);
  }
}