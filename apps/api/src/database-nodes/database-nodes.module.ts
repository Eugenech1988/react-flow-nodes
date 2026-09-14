import { Module } from '@nestjs/common';
import { DatabaseNodesService } from './database-nodes.service';

@Module({
  providers: [DatabaseNodesService],
  exports: [DatabaseNodesService],
})
export class DatabaseNodesModule {}
