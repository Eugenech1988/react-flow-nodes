import { PrismaService } from '../prisma/prisma.service.js';
import { Prisma } from '@prisma/client';
import { TCreateExecutionInputData, TUpdateExecutionInputData } from '@pipeline/contracts';
interface FindAllOptions {
    userId?: string;
    pipelineId?: string;
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
}
export declare class ExecutionsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private formatDurationToMMSS;
    private mapExecutionResponse;
    create(data: TCreateExecutionInputData): Promise<{
        pipeline: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        pipelineId: string;
        status: import("@prisma/client").$Enums.ExecutionStatus;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        triggeredBy: import("@prisma/client").$Enums.TriggerType;
        startedAt: Date;
        finishedAt: Date | null;
        durationMs: number | null;
        nodesExecuted: number;
        logs: Prisma.JsonValue | null;
    } & {
        durationFormatted: string | null;
    }>;
    findAll(options?: FindAllOptions): Promise<{
        items: ({
            pipeline: {
                id: string;
                name: string;
            };
        } & {
            id: string;
            pipelineId: string;
            status: import("@prisma/client").$Enums.ExecutionStatus;
            userId: string;
            createdAt: Date;
            updatedAt: Date;
            triggeredBy: import("@prisma/client").$Enums.TriggerType;
            startedAt: Date;
            finishedAt: Date | null;
            durationMs: number | null;
            nodesExecuted: number;
            logs: Prisma.JsonValue | null;
        } & {
            durationFormatted: string | null;
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<{
        pipeline: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        pipelineId: string;
        status: import("@prisma/client").$Enums.ExecutionStatus;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        triggeredBy: import("@prisma/client").$Enums.TriggerType;
        startedAt: Date;
        finishedAt: Date | null;
        durationMs: number | null;
        nodesExecuted: number;
        logs: Prisma.JsonValue | null;
    } & {
        durationFormatted: string | null;
    }>;
    update(id: string, data: TUpdateExecutionInputData): Promise<{
        id: string;
        pipelineId: string;
        status: import("@prisma/client").$Enums.ExecutionStatus;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        triggeredBy: import("@prisma/client").$Enums.TriggerType;
        startedAt: Date;
        finishedAt: Date | null;
        durationMs: number | null;
        nodesExecuted: number;
        logs: Prisma.JsonValue | null;
    } & {
        durationFormatted: string | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        pipelineId: string;
        status: import("@prisma/client").$Enums.ExecutionStatus;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        triggeredBy: import("@prisma/client").$Enums.TriggerType;
        startedAt: Date;
        finishedAt: Date | null;
        durationMs: number | null;
        nodesExecuted: number;
        logs: Prisma.JsonValue | null;
    }>;
}
export {};
