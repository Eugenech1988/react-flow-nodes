import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { TCreateDatabaseNodeInputData } from '@pipeline/contracts';
import { Prisma } from '@prisma/client';

@Injectable()
export class DatabaseNodesService {
  constructor(private readonly prisma: PrismaService) {}

  async createRecord(userId: string | null, dto: TCreateDatabaseNodeInputData) {
    if (!dto.query || !dto.query.trim().toUpperCase().startsWith('SELECT')) {
      const errorMsg = 'Only SELECT queries are allowed for security reasons.';
      console.error(errorMsg);
      throw new Error(errorMsg);
    }

    let queryResult: unknown;

    try {
      queryResult = await this.prisma.$queryRawUnsafe(dto.query);
    } catch (error) {
      console.error('Database node execution failed:', error);
      throw error;
    }

    try {
      const existingRecord = await this.prisma.databaseNode.findFirst({
        where: {
          nodeId: dto.nodeId,
          pipelineId: dto.pipelineId || null,
        },
      });

      const payloadData = {
        query: dto.query || null,
        params: dto.params ? (dto.params as unknown as Prisma.InputJsonValue) : Prisma.DbNull,
        data: queryResult !== undefined && queryResult !== null
          ? (queryResult as unknown as Prisma.InputJsonValue)
          : ([] as unknown as Prisma.InputJsonValue),
        status: 'SUCCESS',
        userId: userId || null,
      };

      if (existingRecord) {
        return await this.prisma.databaseNode.update({
          where: { id: existingRecord.id },
          data: payloadData,
        });
      }

      return await this.prisma.databaseNode.create({
        data: {
          nodeId: dto.nodeId,
          pipelineId: dto.pipelineId || null,
          ...payloadData,
        },
      });
    } catch (error) {
      console.error('Failed to save database node record to database:', error);
      throw new InternalServerErrorException('Error saving database node record');
    }
  }

  async findByNodeId(nodeId: string) {
    return this.prisma.databaseNode.findMany({
      where: { nodeId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByPipelineId(pipelineId: string) {
    return this.prisma.databaseNode.findMany({
      where: { pipelineId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    const record = await this.prisma.databaseNode.findUnique({
      where: { id },
    });
    if (!record) {
      throw new NotFoundException('Database node record not found');
    }
    return record;
  }
}