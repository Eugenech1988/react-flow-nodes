import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { PipelinesService } from './pipelines.service';
import { CreatePipelineDto } from './dtos/create-pipeline.dto';

@Controller('pipelines')
export class PipelinesController {
  constructor(private readonly pipelinesService: PipelinesService) {}

  @Post('user/:userId')
  async create(
    @Param('userId') userId: string,
    @Body() dto: CreatePipelineDto,
  ) {
    return this.pipelinesService.create(userId, dto);
  }

  @Get('user/:userId')
  async findAllByUserId(@Param('userId') userId: string) {
    return this.pipelinesService.findAllByUserId(userId);
  }
}