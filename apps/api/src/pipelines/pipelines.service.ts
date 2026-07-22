import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Укажите ваш верный путь к PrismaService

@Injectable()
export class PipelinesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllByUserId(userId: string) {
    return this.prisma.pipeline.findMany({
      where: { userId },
      orderBy: {
        name: 'asc',
      },
    });
  }
}