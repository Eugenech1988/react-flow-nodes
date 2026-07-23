import { IsString, IsOptional, IsDate, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { PipelineStatus } from '@prisma/client';

export class CreatePipelineDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(PipelineStatus)
  @IsOptional()
  status?: PipelineStatus;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  lastRunAt?: Date;

  @IsString()
  @IsOptional()
  lastRunStatus?: string;

  @IsString()
  @IsOptional()
  screenshotUrl?: string;
}