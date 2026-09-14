import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ExecutionsService } from './executions.service';
import type {
  TCreateExecutionInputData,
  TUpdateExecutionInputData,
} from '@pipeline/contracts';

@Controller('executions')
export class ExecutionsController {
  constructor(private readonly executionsService: ExecutionsService) {}

  @Post()
  create(@Body() createExecutionDto: TCreateExecutionInputData) {
    return this.executionsService.create(createExecutionDto);
  }

  @Get()
  findAll(
    @Query('userId') userId?: string,
    @Query('pipelineId') pipelineId?: string,
  ) {
    return this.executionsService.findAll(userId, pipelineId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.executionsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateExecutionDto: TUpdateExecutionInputData,
  ) {
    return this.executionsService.update(id, updateExecutionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.executionsService.remove(id);
  }
}