import type { ApplicationsService } from './applications.service';
export declare const createApplicationsRouter: (applicationsService: ApplicationsService) => import("@trpc/server").TRPCBuiltRouter<{
    ctx: import("../trpc/context").TrpcContext;
    meta: object;
    errorShape: import("@trpc/server").TRPCDefaultErrorShape;
    transformer: false;
}, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
    list: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            jobId?: string | undefined;
        } | undefined;
        output: ({
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
        })[];
        meta: object;
        errorShape: import("@trpc/server").TRPCDefaultErrorShape;
    }>;
    byId: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            id: string;
        };
        output: {
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
        };
        meta: object;
        errorShape: import("@trpc/server").TRPCDefaultErrorShape;
    }>;
    remove: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
        };
        output: {
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
        };
        meta: object;
        errorShape: import("@trpc/server").TRPCDefaultErrorShape;
    }>;
}>>;
