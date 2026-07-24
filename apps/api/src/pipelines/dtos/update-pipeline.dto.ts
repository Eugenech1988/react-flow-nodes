import { PartialType } from '@nestjs/mapped-types';
import { CreatePipelineDto } from '@/pipelines/dtos/create-pipeline.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { PipelineStatus } from '@prisma/client'

export class UpdatePipelineDto extends PartialType(CreatePipelineDto) {
  @IsEnum(PipelineStatus)
  @IsOptional()
  status?: PipelineStatus;
}