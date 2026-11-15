import { PrismaService } from '../prisma/prisma.service.js';
import { Prisma } from '@prisma/client';
import type { TCreatePipelineInputData, TUpdatePipelineInputData } from '@pipeline/contracts';
export declare class PipelinesService {
  private readonly prisma;
  constructor(prisma: PrismaService);
  private isUniqueConstraintViolation;
  private deleteFile;
  create(
    userId: string,
    dto: TCreatePipelineInputData,
    file?: Express.Multer.File,
  ): Promise<{
    id: string;
    status: import('@prisma/client').$Enums.PipelineStatus | null;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    name: string;
    description: string | null;
    lastRunAt: Date | null;
    lastRunStatus: string | null;
    screenshotUrl: string | null;
    graphData: Prisma.JsonValue | null;
  }>;
  findAllByUserId(userId: string): Promise<
    {
      id: string;
      status: import('@prisma/client').$Enums.PipelineStatus | null;
      userId: string;
      createdAt: Date;
      updatedAt: Date;
      name: string;
      description: string | null;
      lastRunAt: Date | null;
      lastRunStatus: string | null;
      screenshotUrl: string | null;
      graphData: Prisma.JsonValue | null;
    }[]
  >;
  update(
    id: string,
    userId: string,
    dto: Omit<TUpdatePipelineInputData, 'id'>,
    file?: Express.Multer.File,
  ): Promise<{
    id: string;
    status: import('@prisma/client').$Enums.PipelineStatus | null;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    name: string;
    description: string | null;
    lastRunAt: Date | null;
    lastRunStatus: string | null;
    screenshotUrl: string | null;
    graphData: Prisma.JsonValue | null;
  }>;
  remove(
    id: string,
    userId: string,
  ): Promise<{
    id: string;
    status: import('@prisma/client').$Enums.PipelineStatus | null;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    name: string;
    description: string | null;
    lastRunAt: Date | null;
    lastRunStatus: string | null;
    screenshotUrl: string | null;
    graphData: Prisma.JsonValue | null;
  }>;
}
