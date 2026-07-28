import { IsOptional, IsObject, IsString, IsEnum, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { PipelineStatus } from '@prisma/client';
import type { IFlowGraphState } from '@/pipelines/types';

export class UpdatePipelineDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string | null;

  @IsOptional()
  @IsEnum(PipelineStatus)
  status?: PipelineStatus;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  lastRunAt?: Date;

  @IsOptional()
  @IsString()
  lastRunStatus?: string;

  @IsOptional()
  @IsObject()
  graphData?: IFlowGraphState;
}