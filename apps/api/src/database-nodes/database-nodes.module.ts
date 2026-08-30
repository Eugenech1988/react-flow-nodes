import { Module } from '@nestjs/common';
import { DatabaseNodesService } from './database-nodes.service';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [DatabaseNodesService],
  exports: [DatabaseNodesService],
})
export class DatabaseNodesModule {}
