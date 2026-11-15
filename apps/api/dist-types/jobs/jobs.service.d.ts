import { PrismaService } from '../prisma/prisma.service.js';
import { PortalRevalidateService } from '../portal-revalidate/portal-revalidate.service.js';
import type { TCreateJobInputData, TUpdateJobInputData, TUpsertJobTranslationInputData } from '@pipeline/contracts';
interface IFindAllJobsOptions {
    locale?: string;
    department?: string;
    includeUnpublished?: boolean;
}
export declare class JobsService {
    private readonly prisma;
    private readonly revalidate;
    constructor(prisma: PrismaService, revalidate: PortalRevalidateService);
    findAll(options?: IFindAllJobsOptions): Promise<({
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
        type: import("@prisma/client").$Enums.JobType;
        id: string;
        status: import("@prisma/client").$Enums.JobStatus;
        createdAt: Date;
        updatedAt: Date;
        location: string;
        department: import("@prisma/client").$Enums.JobDepartment;
        level: import("@prisma/client").$Enums.JobLevel;
        slug: string;
        icon: string | null;
        views: number;
        applications: number;
        authorId: string | null;
        publishedAt: Date | null;
    })[]>;
    findOneBySlug(slug: string, _locale?: string): Promise<{
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
        type: import("@prisma/client").$Enums.JobType;
        id: string;
        status: import("@prisma/client").$Enums.JobStatus;
        createdAt: Date;
        updatedAt: Date;
        location: string;
        department: import("@prisma/client").$Enums.JobDepartment;
        level: import("@prisma/client").$Enums.JobLevel;
        slug: string;
        icon: string | null;
        views: number;
        applications: number;
        authorId: string | null;
        publishedAt: Date | null;
    }>;
    findAllAdmin(): Promise<({
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
        type: import("@prisma/client").$Enums.JobType;
        id: string;
        status: import("@prisma/client").$Enums.JobStatus;
        createdAt: Date;
        updatedAt: Date;
        location: string;
        department: import("@prisma/client").$Enums.JobDepartment;
        level: import("@prisma/client").$Enums.JobLevel;
        slug: string;
        icon: string | null;
        views: number;
        applications: number;
        authorId: string | null;
        publishedAt: Date | null;
    })[]>;
    findOne(id: string): Promise<{
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
        type: import("@prisma/client").$Enums.JobType;
        id: string;
        status: import("@prisma/client").$Enums.JobStatus;
        createdAt: Date;
        updatedAt: Date;
        location: string;
        department: import("@prisma/client").$Enums.JobDepartment;
        level: import("@prisma/client").$Enums.JobLevel;
        slug: string;
        icon: string | null;
        views: number;
        applications: number;
        authorId: string | null;
        publishedAt: Date | null;
    }>;
    create(data: TCreateJobInputData, authorId: string): Promise<{
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
        type: import("@prisma/client").$Enums.JobType;
        id: string;
        status: import("@prisma/client").$Enums.JobStatus;
        createdAt: Date;
        updatedAt: Date;
        location: string;
        department: import("@prisma/client").$Enums.JobDepartment;
        level: import("@prisma/client").$Enums.JobLevel;
        slug: string;
        icon: string | null;
        views: number;
        applications: number;
        authorId: string | null;
        publishedAt: Date | null;
    }>;
    update(id: string, data: TUpdateJobInputData): Promise<({
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
        type: import("@prisma/client").$Enums.JobType;
        id: string;
        status: import("@prisma/client").$Enums.JobStatus;
        createdAt: Date;
        updatedAt: Date;
        location: string;
        department: import("@prisma/client").$Enums.JobDepartment;
        level: import("@prisma/client").$Enums.JobLevel;
        slug: string;
        icon: string | null;
        views: number;
        applications: number;
        authorId: string | null;
        publishedAt: Date | null;
    }) | null>;
    publish(id: string): Promise<{
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
        type: import("@prisma/client").$Enums.JobType;
        id: string;
        status: import("@prisma/client").$Enums.JobStatus;
        createdAt: Date;
        updatedAt: Date;
        location: string;
        department: import("@prisma/client").$Enums.JobDepartment;
        level: import("@prisma/client").$Enums.JobLevel;
        slug: string;
        icon: string | null;
        views: number;
        applications: number;
        authorId: string | null;
        publishedAt: Date | null;
    }>;
    archive(id: string): Promise<{
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
        type: import("@prisma/client").$Enums.JobType;
        id: string;
        status: import("@prisma/client").$Enums.JobStatus;
        createdAt: Date;
        updatedAt: Date;
        location: string;
        department: import("@prisma/client").$Enums.JobDepartment;
        level: import("@prisma/client").$Enums.JobLevel;
        slug: string;
        icon: string | null;
        views: number;
        applications: number;
        authorId: string | null;
        publishedAt: Date | null;
    }>;
    remove(id: string): Promise<{
        type: import("@prisma/client").$Enums.JobType;
        id: string;
        status: import("@prisma/client").$Enums.JobStatus;
        createdAt: Date;
        updatedAt: Date;
        location: string;
        department: import("@prisma/client").$Enums.JobDepartment;
        level: import("@prisma/client").$Enums.JobLevel;
        slug: string;
        icon: string | null;
        views: number;
        applications: number;
        authorId: string | null;
        publishedAt: Date | null;
    }>;
    upsertTranslation(jobId: string, data: TUpsertJobTranslationInputData): Promise<{
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
    }>;
    removeTranslation(jobId: string, locale: string): Promise<{
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
    }>;
    incrementViews(id: string): Promise<{
        type: import("@prisma/client").$Enums.JobType;
        id: string;
        status: import("@prisma/client").$Enums.JobStatus;
        createdAt: Date;
        updatedAt: Date;
        location: string;
        department: import("@prisma/client").$Enums.JobDepartment;
        level: import("@prisma/client").$Enums.JobLevel;
        slug: string;
        icon: string | null;
        views: number;
        applications: number;
        authorId: string | null;
        publishedAt: Date | null;
    }>;
    incrementApplications(id: string): Promise<{
        type: import("@prisma/client").$Enums.JobType;
        id: string;
        status: import("@prisma/client").$Enums.JobStatus;
        createdAt: Date;
        updatedAt: Date;
        location: string;
        department: import("@prisma/client").$Enums.JobDepartment;
        level: import("@prisma/client").$Enums.JobLevel;
        slug: string;
        icon: string | null;
        views: number;
        applications: number;
        authorId: string | null;
        publishedAt: Date | null;
    }>;
}
export {};
