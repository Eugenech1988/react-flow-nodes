import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { TCreateExecutionInputData, TUpdateExecutionInputData, } from '@pipeline/contracts';

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

  async findAll(userId?: string, pipelineId?: string) {
    const executions = await this.prisma.execution.findMany({
      where: {
        ...(userId && { userId }),
        ...(pipelineId && { pipelineId }),
      },
      orderBy: {
        startedAt: 'desc',
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

    return executions.map((exec) => this.mapExecutionResponse(exec));
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