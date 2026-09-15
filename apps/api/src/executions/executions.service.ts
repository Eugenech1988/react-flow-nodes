import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Prisma, ExecutionStatus } from '@prisma/client';
import { TCreateExecutionInputData, TUpdateExecutionInputData, } from '@pipeline/contracts';

interface FindAllOptions {
  userId?: string;
  pipelineId?: string;
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

@Injectable()
export class ExecutionsService {
  constructor(private readonly prisma: PrismaService) {}

  private formatDurationToMMSS(durationMs: number | null | undefined): string | null {
    if (durationMs === null || durationMs === undefined) return null;

    const totalSeconds = Math.floor(durationMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    return `${formattedMinutes}.${formattedSeconds}`;
  }

  private mapExecutionResponse<T extends { durationMs?: number | null }>(execution: T) {
    return {
      ...execution,
      durationFormatted: this.formatDurationToMMSS(execution.durationMs),
    };
  }

  async create(data: TCreateExecutionInputData) {
    const execution = await this.prisma.execution.create({
      data: {
        pipelineId: data.pipelineId,
        userId: data.userId,
        status: data.status,
        triggeredBy: data.triggeredBy,
        logs: (data.logs as Prisma.InputJsonValue) ?? Prisma.JsonNull,
        nodesExecuted: data.nodesExecuted ?? 0,
      },
      include: {
        pipeline: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return this.mapExecutionResponse(execution);
  }

  async findAll(options?: FindAllOptions) {
    const userId = options?.userId;
    const pipelineId = options?.pipelineId;
    const search = options?.search?.trim();
    const status = options?.status;

    const page = options?.page && options.page > 0 ? options.page : 1;
    const limit = options?.limit && options.limit > 0 ? options.limit : 10;
    const skip = (page - 1) * limit;

    // Безопасно приводим статус к верхнему регистру и типу ExecutionStatus
    const validStatus = status && status !== 'all' ? (status.toUpperCase() as ExecutionStatus) : undefined;

    // Формируем гибкий where для Prisma
    const whereClause: Prisma.ExecutionWhereInput = {
      ...(userId && { userId }),
      ...(pipelineId && { pipelineId }),
      ...(validStatus && { status: validStatus }), // <-- Используем валидный статус
      ...(search && {
        OR: [
          { id: { contains: search, mode: 'insensitive' } },
          { pipeline: { name: { contains: search, mode: 'insensitive' } } },
        ],
      }),
    };

    const [executions, total] = await Promise.all([
      this.prisma.execution.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { startedAt: 'desc' },
        include: {
          pipeline: { select: { id: true, name: true } },
        },
      }),
      this.prisma.execution.count({ where: whereClause }),
    ]);

    return {
      items: executions.map((exec) => this.mapExecutionResponse(exec)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const execution = await this.prisma.execution.findUnique({
      where: { id },
      include: {
        pipeline: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!execution) {
      throw new NotFoundException(`Execution with ID "${id}" not found`);
    }

    return this.mapExecutionResponse(execution);
  }

  async update(id: string, data: TUpdateExecutionInputData) {
    const execution = await this.findOne(id);

    let durationMs = data.durationMs;
    const finishedAt = data.finishedAt ? new Date(data.finishedAt) : undefined;

    if (finishedAt && !durationMs) {
      durationMs = finishedAt.getTime() - new Date(execution.startedAt).getTime();
    }

    const updatedExecution = await this.prisma.execution.update({
      where: { id },
      data: {
        status: data.status,
        finishedAt,
        durationMs,
        nodesExecuted: data.nodesExecuted,
        logs: (data.logs as Prisma.InputJsonValue) ?? Prisma.JsonNull,
      },
    });

    return this.mapExecutionResponse(updatedExecution);
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.execution.delete({
      where: { id },
    });
  }
}