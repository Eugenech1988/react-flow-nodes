import { Module, Global } from '@nestjs/common';
import { InngestController } from './inngest.controller';
import { inngest, INNGEST_CLIENT } from './inngest.client';

@Global()
@Module({
  controllers: [InngestController],
  providers: [
    {
      provide: INNGEST_CLIENT,
      useValue: inngest,
    },
  ],
  exports: [INNGEST_CLIENT],
})
export class InngestModule {}