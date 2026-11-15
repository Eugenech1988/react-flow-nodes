import type { UsersService } from './users.service';
export declare const createUsersRouter: (usersService: UsersService) => import("@trpc/server").TRPCBuiltRouter<{
    ctx: import("../trpc/context").TrpcContext;
    meta: object;
    errorShape: import("@trpc/server").TRPCDefaultErrorShape;
    transformer: false;
}, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
    updatePassword: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            newPassword: string;
            currentPassword?: string | undefined;
        };
        output: {
            success: boolean;
        };
        meta: object;
        errorShape: import("@trpc/server").TRPCDefaultErrorShape;
    }>;
    remove: import("@trpc/server").TRPCMutationProcedure<{
        input: void;
        output: {
            success: boolean;
        };
        meta: object;
        errorShape: import("@trpc/server").TRPCDefaultErrorShape;
    }>;
    setCurrentPipeline: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            id: string;
            name?: string | undefined;
            description?: string | null | undefined;
            status?: "DRAFT" | "ACTIVE" | "PAUSED" | "ARCHIVED" | null | undefined;
            lastRunAt?: string | Date | null | undefined;
            lastRunStatus?: "SUCCESS" | "FAILED" | "RUNNING" | null | undefined;
            screenshotUrl?: string | null | undefined;
        };
        output: Omit<{
            profile: {
                firstName: string;
                lastName: string | null;
                nickName: string;
                id: string;
                userId: string;
                createdAt: Date;
                updatedAt: Date;
                company: string | null;
                location: string | null;
                jobTitle: string | null;
                avatarUrl: string | null;
            } | null;
            subscription: {
                plan: import("@prisma/client").$Enums.Plan;
                id: string;
                userId: string;
                createdAt: Date;
                updatedAt: Date;
                planStatus: import("@prisma/client").$Enums.SubscriptionStatus;
                customerId: string | null;
                subscriptionId: string | null;
                currentPeriodStart: Date;
                currentPeriodEnd: Date;
                cancelAtPeriodEnd: boolean;
            } | null;
            currentPipeline: {
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
            } | null;
        } & {
            email: string;
            password: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            hasPassword: boolean;
            role: import("@prisma/client").$Enums.Role;
            provider: string;
            providerId: string;
            isTwoFactorEnabled: boolean;
            twoFactorSecret: string | null;
            recoveryCodes: string[];
            currentPipelineId: string | null;
        }, "password" | "twoFactorSecret" | "recoveryCodes">;
        meta: object;
        errorShape: import("@trpc/server").TRPCDefaultErrorShape;
    }>;
}>>;
