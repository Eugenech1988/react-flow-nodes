import type { TrpcContext } from './context.js';
export declare const router: import('@trpc/server').TRPCRouterBuilder<{
  ctx: TrpcContext;
  meta: object;
  errorShape: import('@trpc/server').TRPCDefaultErrorShape;
  transformer: false;
}>;
export declare const publicProcedure: import('@trpc/server').TRPCProcedureBuilder<
  TrpcContext,
  object,
  object,
  import('@trpc/server').TRPCUnsetMarker,
  import('@trpc/server').TRPCUnsetMarker,
  import('@trpc/server').TRPCUnsetMarker,
  import('@trpc/server').TRPCUnsetMarker,
  false,
  import('@trpc/server').TRPCDefaultErrorShape
>;
export declare const protectedProcedure: import('@trpc/server').TRPCProcedureBuilder<
  TrpcContext,
  object,
  {
    user: {
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
        plan: import('@prisma/client').$Enums.Plan;
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        planStatus: import('@prisma/client').$Enums.SubscriptionStatus;
        customerId: string | null;
        subscriptionId: string | null;
        currentPeriodStart: Date;
        currentPeriodEnd: Date;
        cancelAtPeriodEnd: boolean;
      } | null;
      currentPipeline: {
        id: string;
        status: import('@prisma/client').$Enums.PipelineStatus | null;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        lastRunAt: Date | null;
        lastRunStatus: string | null;
        screenshotUrl: string | null;
        graphData: import('@prisma/client/runtime/client').JsonValue | null;
      } | null;
    } & {
      email: string;
      password: string | null;
      id: string;
      createdAt: Date;
      updatedAt: Date;
      hasPassword: boolean;
      role: import('@prisma/client').$Enums.Role;
      provider: string;
      providerId: string;
      isTwoFactorEnabled: boolean;
      twoFactorSecret: string | null;
      recoveryCodes: string[];
      currentPipelineId: string | null;
    };
  },
  import('@trpc/server').TRPCUnsetMarker,
  import('@trpc/server').TRPCUnsetMarker,
  import('@trpc/server').TRPCUnsetMarker,
  import('@trpc/server').TRPCUnsetMarker,
  false,
  import('@trpc/server').TRPCDefaultErrorShape
>;
export declare const contentManagerProcedure: import('@trpc/server').TRPCProcedureBuilder<
  TrpcContext,
  object,
  {
    user: {
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
        plan: import('@prisma/client').$Enums.Plan;
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        planStatus: import('@prisma/client').$Enums.SubscriptionStatus;
        customerId: string | null;
        subscriptionId: string | null;
        currentPeriodStart: Date;
        currentPeriodEnd: Date;
        cancelAtPeriodEnd: boolean;
      } | null;
      currentPipeline: {
        id: string;
        status: import('@prisma/client').$Enums.PipelineStatus | null;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        lastRunAt: Date | null;
        lastRunStatus: string | null;
        screenshotUrl: string | null;
        graphData: import('@prisma/client/runtime/client').JsonValue | null;
      } | null;
    } & {
      email: string;
      password: string | null;
      id: string;
      createdAt: Date;
      updatedAt: Date;
      hasPassword: boolean;
      role: import('@prisma/client').$Enums.Role;
      provider: string;
      providerId: string;
      isTwoFactorEnabled: boolean;
      twoFactorSecret: string | null;
      recoveryCodes: string[];
      currentPipelineId: string | null;
    };
  },
  import('@trpc/server').TRPCUnsetMarker,
  import('@trpc/server').TRPCUnsetMarker,
  import('@trpc/server').TRPCUnsetMarker,
  import('@trpc/server').TRPCUnsetMarker,
  false,
  import('@trpc/server').TRPCDefaultErrorShape
>;
export declare const superAdminProcedure: import('@trpc/server').TRPCProcedureBuilder<
  TrpcContext,
  object,
  {
    user: {
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
        plan: import('@prisma/client').$Enums.Plan;
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        planStatus: import('@prisma/client').$Enums.SubscriptionStatus;
        customerId: string | null;
        subscriptionId: string | null;
        currentPeriodStart: Date;
        currentPeriodEnd: Date;
        cancelAtPeriodEnd: boolean;
      } | null;
      currentPipeline: {
        id: string;
        status: import('@prisma/client').$Enums.PipelineStatus | null;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        lastRunAt: Date | null;
        lastRunStatus: string | null;
        screenshotUrl: string | null;
        graphData: import('@prisma/client/runtime/client').JsonValue | null;
      } | null;
    } & {
      email: string;
      password: string | null;
      id: string;
      createdAt: Date;
      updatedAt: Date;
      hasPassword: boolean;
      role: import('@prisma/client').$Enums.Role;
      provider: string;
      providerId: string;
      isTwoFactorEnabled: boolean;
      twoFactorSecret: string | null;
      recoveryCodes: string[];
      currentPipelineId: string | null;
    };
  },
  import('@trpc/server').TRPCUnsetMarker,
  import('@trpc/server').TRPCUnsetMarker,
  import('@trpc/server').TRPCUnsetMarker,
  import('@trpc/server').TRPCUnsetMarker,
  false,
  import('@trpc/server').TRPCDefaultErrorShape
>;
