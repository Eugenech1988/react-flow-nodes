import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateDatabaseNodeInputDto {
  @ApiPropertyOptional({
    description: 'Unique identifier of the database node record',
    example: 'clx123abc00001234567890ab',
  })
  @IsOptional()
  @IsString()
  id?: string | null | undefined;

  @ApiPropertyOptional({
    description: 'Associated pipeline ID',
    example: 'clx987xyz00009876543210zy',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  pipelineId?: string | null;

  @ApiProperty({
    description: 'Node identifier within the pipeline graph',
    example: 'node-1',
  })
  @IsString()
  nodeId: string;

  @ApiPropertyOptional({
    description: 'Raw SQL or custom query string',
    example: 'SELECT * FROM users;',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  query?: string | null;

  @ApiPropertyOptional({
    description: 'Query execution parameters',
    example: { limit: 10, offset: 0 },
    nullable: true,
  })
  @IsOptional()
  @IsObject()
  params?: Record<string, unknown> | null;

  @ApiPropertyOptional({
    description: 'Arbitrary execution result data',
    example: { result: [1, 2, 3] },
    nullable: true,
  })
  @IsOptional()
  data?: unknown | null;

  @ApiPropertyOptional({
    description: 'Execution status of the node',
    example: 'SUCCESS',
    default: 'SUCCESS',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  status?: string | null;

  @ApiPropertyOptional({
    description: 'ID of the user who owns or triggered this node',
    example: 'usr123abc',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  userId?: string | null;

  @ApiPropertyOptional({
    description: 'Record creation timestamp (ISO 8601 format)',
    example: '2026-09-14T20:00:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  createdAt?: string | Date | null;

  @ApiPropertyOptional({
    description: 'Record update timestamp (ISO 8601 format)',
    example: '2026-09-14T20:00:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  updatedAt?: string | Date | null;
}