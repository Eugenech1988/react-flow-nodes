import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePipelineDto } from './dtos/create-pipeline.dto';
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
          screenshotUrl,
          status: 'DRAFT',
          userId,
        },
      });
    } catch (error) {
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