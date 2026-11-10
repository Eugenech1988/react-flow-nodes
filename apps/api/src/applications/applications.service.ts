import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { MailService } from '@/mail/mail.service';
import type { TJobApplicationCreateData, TApplicationListFilterData } from '@pipeline/contracts';

@Injectable()
export class ApplicationsService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

  async create(data: TJobApplicationCreateData) {
    const application = await this.prisma.jobApplication.create({
      data,
    });

    await this.prisma.job.update({
      where: { id: data.jobId },
      data: { applications: { increment: 1 } },
    });

    await this.mailService.sendApplicationEmail(data);

    return application;
  }

  async findAll(options?: TApplicationListFilterData) {
    return this.prisma.jobApplication.findMany({
      where: {
        ...(options?.jobId && { jobId: options.jobId }),
      },
      include: {
        job: {
          include: {
            translations: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const application = await this.prisma.jobApplication.findUnique({
      where: { id },
      include: {
        job: {
          include: {
            translations: true,
          },
        },
      },
    });

    if (!application) {
      throw new NotFoundException(`Application with ID "${id}" not found`);
    }

    return application;
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.jobApplication.delete({ where: { id } });
  }
}
