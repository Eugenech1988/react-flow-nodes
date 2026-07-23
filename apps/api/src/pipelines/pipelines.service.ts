import { Injectable, InternalServerErrorException, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePipelineDto } from './dtos/create-pipeline.dto';
import { UpdatePipelineDto } from './dtos/update-pipeline.dto';
import * as fs from 'node:fs/promises';
import path from 'node:path';

@Injectable()
export class PipelinesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    userId: string,
    dto: CreatePipelineDto,
    file?: Express.Multer.File,
  ) {
    const screenshotUrl = file ? `/uploads/screenshots/${file.filename}` : null;

    try {
      return await this.prisma.pipeline.create({
        data: {
          name: dto.name,
          description: dto.description || null,
          status: 'DRAFT',
          screenshotUrl,
          userId,
        },
      });
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new BadRequestException('Pipeline with this name already exists');
      }
      console.error('Failed to create pipeline:', error);
      throw new InternalServerErrorException('Error creating pipeline');
    }
  }

  async findAllByUserId(userId: string) {
    return this.prisma.pipeline.findMany({
      where: { userId },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async update(
    id: string,
    dto: UpdatePipelineDto,
    file?: Express.Multer.File,
  ) {
    const existingPipeline = await this.prisma.pipeline.findUnique({
      where: { id },
    });

    if (!existingPipeline) {
      throw new NotFoundException('Pipeline not found');
    }

    let screenshotUrl = existingPipeline.screenshotUrl;

    if (file) {
      screenshotUrl = `/uploads/screenshots/${file.filename}`;
      if (existingPipeline.screenshotUrl) {
        try {
          const oldFilePath = path.join(process.cwd(), existingPipeline.screenshotUrl);
          await fs.unlink(oldFilePath);
        } catch (err) {
          console.warn(`Failed to delete old file:`, err);
        }
      }
    }

    try {
      return await this.prisma.pipeline.update({
        where: { id },
        data: {
          ...(dto.name && { name: dto.name }),
          ...(dto.description !== undefined && { description: dto.description }),
          ...(dto.status && { status: dto.status }),
          ...(dto.lastRunAt && { lastRunAt: dto.lastRunAt }),
          ...(dto.lastRunStatus && { lastRunStatus: dto.lastRunStatus }),
          screenshotUrl,
        },
      });
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new BadRequestException('Pipeline with this name already exists');
      }
      console.error('Failed to update pipeline:', error);
      throw new InternalServerErrorException('Error updating pipeline');
    }
  }

  async remove(id: string) {
    const pipeline = await this.prisma.pipeline.findUnique({
      where: { id },
    });

    if (!pipeline) {
      throw new NotFoundException('Pipeline not found');
    }

    if (pipeline.screenshotUrl) {
      try {
        const filePath = path.join(process.cwd(), pipeline.screenshotUrl);
        await fs.unlink(filePath);
      } catch (err) {
        console.warn(`Failed to delete file at ${pipeline.screenshotUrl}:`, err);
      }
    }

    try {
      return await this.prisma.pipeline.delete({
        where: { id },
      });
    } catch (error) {
      console.error('Failed to delete pipeline:', error);
      throw new InternalServerErrorException('Error deleting pipeline');
    }
  }
}