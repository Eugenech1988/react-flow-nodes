import type { JobsService } from './jobs.service';
export declare const createJobsRouter: (jobsService: JobsService) => import("@trpc/server").TRPCBuiltRouter<{
    ctx: import("../trpc/context").TrpcContext;
    meta: object;
    errorShape: import("@trpc/server").TRPCDefaultErrorShape;
    transformer: false;
}, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
    list: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            locale?: string | undefined;
            department?: string | undefined;
        } | undefined;
        output: ({
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
        })[];
        meta: object;
        errorShape: import("@trpc/server").TRPCDefaultErrorShape;
    }>;
    bySlug: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            slug: string;
            locale?: string | undefined;
        };
        output: {
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
        meta: object;
        errorShape: import("@trpc/server").TRPCDefaultErrorShape;
    }>;
    adminList: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: ({
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
        })[];
        meta: object;
        errorShape: import("@trpc/server").TRPCDefaultErrorShape;
    }>;
    adminById: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            id: string;
        };
        output: {
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
        meta: object;
        errorShape: import("@trpc/server").TRPCDefaultErrorShape;
    }>;
    create: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            slug: string;
            department: "ENGINEERING" | "DESIGN" | "RESEARCH" | "OPERATIONS";
            level: "JUNIOR" | "MID" | "SENIOR" | "LEAD";
            location: string;
            translations: {
                locale: string;
                title: string;
                description: string;
                responsibilities?: string[] | undefined;
                requirements?: string[] | undefined;
                metaTitle?: string | undefined;
                metaDescription?: string | undefined;
            }[];
            type?: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP" | undefined;
            icon?: string | undefined;
            status?: "DRAFT" | "ARCHIVED" | "PUBLISHED" | undefined;
        };
        output: {
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
        meta: object;
        errorShape: import("@trpc/server").TRPCDefaultErrorShape;
    }>;
    update: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
            data: {
                slug?: string | undefined;
                department?: "ENGINEERING" | "DESIGN" | "RESEARCH" | "OPERATIONS" | undefined;
                level?: "JUNIOR" | "MID" | "SENIOR" | "LEAD" | undefined;
                type?: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP" | undefined;
                location?: string | undefined;
                icon?: string | null | undefined;
                status?: "DRAFT" | "ARCHIVED" | "PUBLISHED" | undefined;
                translations?: {
                    locale: string;
                    title: string;
                    description: string;
                    responsibilities?: string[] | undefined;
                    requirements?: string[] | undefined;
                    metaTitle?: string | undefined;
                    metaDescription?: string | undefined;
                }[] | undefined;
            };
        };
        output: ({
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
        }) | null;
        meta: object;
        errorShape: import("@trpc/server").TRPCDefaultErrorShape;
    }>;
    publish: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
        };
        output: {
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
        meta: object;
        errorShape: import("@trpc/server").TRPCDefaultErrorShape;
    }>;
    archive: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
        };
        output: {
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
        meta: object;
        errorShape: import("@trpc/server").TRPCDefaultErrorShape;
    }>;
    remove: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
        };
        output: {
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
        meta: object;
        errorShape: import("@trpc/server").TRPCDefaultErrorShape;
    }>;
    upsertTranslation: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            jobId: string;
            data: {
                locale: string;
                title: string;
                description: string;
                responsibilities?: string[] | undefined;
                requirements?: string[] | undefined;
                metaTitle?: string | undefined;
                metaDescription?: string | undefined;
            };
        };
        output: {
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
        };
        meta: object;
        errorShape: import("@trpc/server").TRPCDefaultErrorShape;
    }>;
    removeTranslation: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            jobId: string;
            locale: string;
        };
        output: {
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
        };
        meta: object;
        errorShape: import("@trpc/server").TRPCDefaultErrorShape;
    }>;
    incrementViews: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
        };
        output: {
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
        meta: object;
        errorShape: import("@trpc/server").TRPCDefaultErrorShape;
    }>;
    incrementApplications: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
        };
        output: {
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
        meta: object;
        errorShape: import("@trpc/server").TRPCDefaultErrorShape;
    }>;
}>>;
