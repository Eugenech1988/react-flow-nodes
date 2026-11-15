import { PrismaService } from '../prisma/prisma.service.js';
import { MailService } from '../mail/mail.service.js';
import type { TJobApplicationCreateData, TApplicationListFilterData } from '@pipeline/contracts';
export declare class ApplicationsService {
  private prisma;
  private mailService;
  constructor(prisma: PrismaService, mailService: MailService);
  create(data: TJobApplicationCreateData): Promise<{
    message: string | null;
    email: string;
    id: string;
    createdAt: Date;
    position: string;
    name: string;
    company: string;
    jobId: string;
    resumeUrl: string;
    coverLetterUrl: string | null;
  }>;
  findAll(options?: TApplicationListFilterData): Promise<
    ({
      job: {
        translations: {
          id: string;
          createdAt: Date;
          updatedAt: Date;
          description: string;
          locale: string;
          title: string;
          responsibilities: string[];
          requirements: string[];
          metaTitle: string | null;
          metaDescription: string | null;
          jobId: string;
        }[];
      } & {
        type: import('@prisma/client').$Enums.JobType;
        id: string;
        status: import('@prisma/client').$Enums.JobStatus;
        createdAt: Date;
        updatedAt: Date;
        location: string;
        department: import('@prisma/client').$Enums.JobDepartment;
        level: import('@prisma/client').$Enums.JobLevel;
        slug: string;
        icon: string | null;
        views: number;
        applications: number;
        authorId: string | null;
        publishedAt: Date | null;
      };
    } & {
      message: string | null;
      email: string;
      id: string;
      createdAt: Date;
      position: string;
      name: string;
      company: string;
      jobId: string;
      resumeUrl: string;
      coverLetterUrl: string | null;
    })[]
  >;
  findOne(id: string): Promise<
    {
      job: {
        translations: {
          id: string;
          createdAt: Date;
          updatedAt: Date;
          description: string;
          locale: string;
          title: string;
          responsibilities: string[];
          requirements: string[];
          metaTitle: string | null;
          metaDescription: string | null;
          jobId: string;
        }[];
      } & {
        type: import('@prisma/client').$Enums.JobType;
        id: string;
        status: import('@prisma/client').$Enums.JobStatus;
        createdAt: Date;
        updatedAt: Date;
        location: string;
        department: import('@prisma/client').$Enums.JobDepartment;
        level: import('@prisma/client').$Enums.JobLevel;
        slug: string;
        icon: string | null;
        views: number;
        applications: number;
        authorId: string | null;
        publishedAt: Date | null;
      };
    } & {
      message: string | null;
      email: string;
      id: string;
      createdAt: Date;
      position: string;
      name: string;
      company: string;
      jobId: string;
      resumeUrl: string;
      coverLetterUrl: string | null;
    }
  >;
  remove(id: string): Promise<{
    message: string | null;
    email: string;
    id: string;
    createdAt: Date;
    position: string;
    name: string;
    company: string;
    jobId: string;
    resumeUrl: string;
    coverLetterUrl: string | null;
  }>;
}
