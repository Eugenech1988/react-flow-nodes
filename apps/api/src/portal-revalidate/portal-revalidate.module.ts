import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PortalRevalidateService } from './portal-revalidate.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [PortalRevalidateService],
  exports: [PortalRevalidateService],
})
export class PortalRevalidateModule {}
