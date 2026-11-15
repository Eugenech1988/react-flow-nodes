import { PrismaService } from '../prisma/prisma.service.js';
import { CreateDatabaseNodeInputDto } from './dtos/createDatabaseNode.dto';
import { Prisma } from '@prisma/client';
export declare class DatabaseNodesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createRecord(userId: string | null, dto: CreateDatabaseNodeInputDto): Promise<{
        params: Prisma.JsonValue | null;
        id: string;
        pipelineId: string | null;
        nodeId: string;
        query: string | null;
        data: Prisma.JsonValue | null;
        status: string | null;
        userId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findByNodeId(nodeId: string): Promise<{
        params: Prisma.JsonValue | null;
        id: string;
        pipelineId: string | null;
        nodeId: string;
        query: string | null;
        data: Prisma.JsonValue | null;
        status: string | null;
        userId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findByPipelineId(pipelineId: string): Promise<{
        params: Prisma.JsonValue | null;
        id: string;
        pipelineId: string | null;
        nodeId: string;
        query: string | null;
        data: Prisma.JsonValue | null;
        status: string | null;
        userId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findById(id: string): Promise<{
        params: Prisma.JsonValue | null;
        id: string;
        pipelineId: string | null;
        nodeId: string;
        query: string | null;
        data: Prisma.JsonValue | null;
        status: string | null;
        userId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
