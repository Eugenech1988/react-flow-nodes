import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { TCreateDatabaseNodeInputData } from '@pipeline/contracts';
import { Prisma } from '@prisma/client';

@Injectable()
export class DatabaseNodesService {
  constructor(private readonly prisma: PrismaService) {}

  async createRecord(userId: string | null, dto: TCreateDatabaseNodeInputData) {
    if (!dto.query || !dto.query.trim().toUpperCase().startsWith('SELECT')) {
      throw new Error('Only SELECT queries are allowed for security reasons.');
    }

    // Если запрос упадет, выполнение прервется здесь, и в базу ничего не запишется
    const queryResult = await this.prisma.$queryRawUnsafe(dto.query);

    try {
      return await this.prisma.databaseNode.create({
        data: {
          nodeId: dto.nodeId,
          pipelineId: dto.pipelineId || null,
          query: dto.query || null,
          params: dto.params ? (dto.params as unknown as Prisma.InputJsonValue) : Prisma.DbNull,
          data: queryResult !== undefined && queryResult !== null
            ? (queryResult as unknown as Prisma.InputJsonValue)
            : ([] as unknown as Prisma.InputJsonValue),
          status: 'SUCCESS',
          userId: userId || null,
        },
      });
    } catch (error) {
      console.error('Failed to create database node record:', error);
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