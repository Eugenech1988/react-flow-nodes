import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePipelineDto } from './dtos/create-pipeline.dto';

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
}