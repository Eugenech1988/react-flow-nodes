import { Injectable, InternalServerErrorException, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreatePipelineDto } from '@/pipelines/dtos/create-pipeline.dto';
import { UpdatePipelineDto } from '@/pipelines/dtos/update-pipeline.dto';
import * as fs from 'node:fs/promises';
import path from 'node:path';
import { Prisma } from '@prisma/client';

@Injectable()
export class PipelinesService {
  constructor(private readonly prisma: PrismaService) {}

  private async deleteFile(relativePath: string | null) {
    if (!relativePath) return;
    try {
      const fullPath = path.join(process.cwd(), relativePath);
      await fs.unlink(fullPath);
    } catch (err) {
      console.warn(`Failed to delete old file at ${relativePath}:`, err);
    }
  }

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
    userId: string,
    dto: UpdatePipelineDto & { screenshotBase64?: string },
    file?: Express.Multer.File,
  ) {
    const existingPipeline = await this.prisma.pipeline.findUnique({
      where: { id },
    });

    if (!existingPipeline) {
      throw new NotFoundException('Pipeline not found');
    }

    if (existingPipeline.userId !== userId) {
      throw new ForbiddenException('You do not have permission to update this pipeline');
    }

    const { screenshotBase64, graphData, ...restDto } = dto;
    let newScreenshotUrl: string | undefined;

    // 1. Сохраняем новый файл перед записью в БД
    if (screenshotBase64) {
      const base64Data = screenshotBase64.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');
      const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}.png`;
      const fullPath = path.join(process.cwd(), 'uploads/screenshots', fileName);

      await fs.mkdir(path.dirname(fullPath), { recursive: true });
      await fs.writeFile(fullPath, buffer);

      newScreenshotUrl = `/uploads/screenshots/${fileName}`;
    } else if (file) {
      newScreenshotUrl = `/uploads/screenshots/${file.filename}`;
    }

    try {
      // 2. Обновляем данные в базе
      const updatedPipeline = await this.prisma.pipeline.update({
        where: { id },
        data: {
          ...restDto,
          ...(graphData !== undefined && {
            graphData: graphData as unknown as Prisma.InputJsonValue,
          }),
          ...(newScreenshotUrl && { screenshotUrl: newScreenshotUrl }),
        },
      });

      // 3. Старый файл удаляем ТОЛЬКО после успешного обновления БД
      if (newScreenshotUrl && existingPipeline.screenshotUrl) {
        await this.deleteFile(existingPipeline.screenshotUrl);
      }

      return updatedPipeline;
    } catch (error: any) {
      // В случае ошибки БД откатываем загруженный новый файл
      if (newScreenshotUrl) {
        await this.deleteFile(newScreenshotUrl);
      }

      if (error.code === 'P2002') {
        throw new BadRequestException('Pipeline with this name already exists');
      }
      console.error('Failed to update pipeline:', error);
      throw new InternalServerErrorException('Error updating pipeline');
    }
  }

  async remove(id: string, userId: string) {
    const pipeline = await this.prisma.pipeline.findUnique({
      where: { id },
    });

    if (!pipeline) {
      throw new NotFoundException('Pipeline not found');
    }

    if (pipeline.userId !== userId) {
      throw new ForbiddenException('You do not have permission to delete this pipeline');
    }

    if (pipeline.screenshotUrl) {
      await this.deleteFile(pipeline.screenshotUrl);
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