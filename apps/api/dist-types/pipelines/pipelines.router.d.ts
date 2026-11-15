import type { PipelinesService } from './pipelines.service';
export declare const createPipelinesRouter: (pipelinesService: PipelinesService) => import("@trpc/server").TRPCBuiltRouter<{
    ctx: import("../trpc/context").TrpcContext;
    meta: object;
    errorShape: import("@trpc/server").TRPCDefaultErrorShape;
    transformer: false;
}, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
    list: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: {
            id: string;
            status: import("@prisma/client").$Enums.PipelineStatus | null;
            userId: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            lastRunAt: Date | null;
            lastRunStatus: string | null;
            screenshotUrl: string | null;
            graphData: import("@prisma/client/runtime/client").JsonValue | null;
        }[];
        meta: object;
        errorShape: import("@trpc/server").TRPCDefaultErrorShape;
    }>;
    remove: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
        };
        output: {
            id: string;
            status: import("@prisma/client").$Enums.PipelineStatus | null;
            userId: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            lastRunAt: Date | null;
            lastRunStatus: string | null;
            screenshotUrl: string | null;
            graphData: import("@prisma/client/runtime/client").JsonValue | null;
        };
        meta: object;
        errorShape: import("@trpc/server").TRPCDefaultErrorShape;
    }>;
    update: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
            name?: string | undefined;
            description?: string | null | undefined;
            status?: "DRAFT" | "ACTIVE" | "PAUSED" | "ARCHIVED" | undefined;
            lastRunAt?: unknown;
            lastRunStatus?: string | null | undefined;
            graphData?: {
                nodes: {
                    [x: string]: unknown;
                    id: string;
                    type: string;
                    position: {
                        x: number;
                        y: number;
                    };
                    data: Record<string, unknown>;
                }[];
                edges: {
                    [x: string]: unknown;
                    id: string;
                    source: string;
                    target: string;
                    sourceHandle?: string | null | undefined;
                    targetHandle?: string | null | undefined;
                }[];
            } | undefined;
            screenshotBase64?: string | null | undefined;
            screenshotUrl?: string | null | undefined;
        };
        output: {
            id: string;
            status: import("@prisma/client").$Enums.PipelineStatus | null;
            userId: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            lastRunAt: Date | null;
            lastRunStatus: string | null;
            screenshotUrl: string | null;
            graphData: import("@prisma/client/runtime/client").JsonValue | null;
        };
        meta: object;
        errorShape: import("@trpc/server").TRPCDefaultErrorShape;
    }>;
}>>;
