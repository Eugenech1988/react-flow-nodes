import { Controller, Get, Param } from '@nestjs/common';
import { PipelinesService } from './pipelines.service';

@Controller('pipelines')
export class PipelinesController {
  constructor(private readonly pipelinesService: PipelinesService) {}

  @Get('user/:userId')
  async findAllByUserId(@Param('userId') userId: string) {
    return this.pipelinesService.findAllByUserId(userId);
  }
}