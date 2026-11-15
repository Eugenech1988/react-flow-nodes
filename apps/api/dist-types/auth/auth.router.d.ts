import type { AuthService } from './auth.service';
export declare const createAuthRouter: (
  authService: AuthService,
) => import('@trpc/server').TRPCBuiltRouter<
  {
    ctx: import('../trpc/context').TrpcContext;
    meta: object;
    errorShape: import('@trpc/server').TRPCDefaultErrorShape;
    transformer: false;
  },
  import('@trpc/server').TRPCDecorateCreateRouterOptions<{
    me: import('@trpc/server').TRPCQueryProcedure<{
      input: void;
      output: Omit<
        {
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
        },
        'password' | 'twoFactorSecret' | 'recoveryCodes'
      > | null;
      meta: object;
      errorShape: import('@trpc/server').TRPCDefaultErrorShape;
    }>;
    login: import('@trpc/server').TRPCMutationProcedure<{
      input: {
        email: string;
        password: string;
      };
      output:
        | {
            isTwoFactorRequired: true;
            tempToken: string;
            user?: undefined;
          }
        | {
            isTwoFactorRequired: false;
            user: Omit<
              import('./types/auth.types').TUserSafe,
              'password' | 'twoFactorSecret' | 'recoveryCodes'
            >;
            tempToken?: undefined;
          };
      meta: object;
      errorShape: import('@trpc/server').TRPCDefaultErrorShape;
    }>;
    loginWith2fa: import('@trpc/server').TRPCMutationProcedure<{
      input: {
        tempToken: string;
        code: string;
      };
      output: Omit<
        import('./types/auth.types').TUserSafe,
        'password' | 'twoFactorSecret' | 'recoveryCodes'
      >;
      meta: object;
      errorShape: import('@trpc/server').TRPCDefaultErrorShape;
    }>;
    generate2fa: import('@trpc/server').TRPCMutationProcedure<{
      input: void;
      output: {
        qrCodeImage: string;
        secret: string;
      };
      meta: object;
      errorShape: import('@trpc/server').TRPCDefaultErrorShape;
    }>;
    turnOn2fa: import('@trpc/server').TRPCMutationProcedure<{
      input: {
        code: string;
      };
      output: {
        success: boolean;
        recoveryCodes: string[];
      };
      meta: object;
      errorShape: import('@trpc/server').TRPCDefaultErrorShape;
    }>;
    turnOff2fa: import('@trpc/server').TRPCMutationProcedure<{
      input: {
        code: string;
      };
      output: {
        success: boolean;
      };
      meta: object;
      errorShape: import('@trpc/server').TRPCDefaultErrorShape;
    }>;
    register: import('@trpc/server').TRPCMutationProcedure<{
      input: {
        email: string;
        password: string;
        firstName?: string | undefined;
        lastName?: string | undefined;
        nickName?: string | undefined;
      };
      output: Omit<
        import('./types/auth.types').TUserSafe,
        'password' | 'twoFactorSecret' | 'recoveryCodes'
      >;
      meta: object;
      errorShape: import('@trpc/server').TRPCDefaultErrorShape;
    }>;
    logout: import('@trpc/server').TRPCMutationProcedure<{
      input: void;
      output: {
        success: boolean;
      };
      meta: object;
      errorShape: import('@trpc/server').TRPCDefaultErrorShape;
    }>;
    requestPasswordReset: import('@trpc/server').TRPCMutationProcedure<{
      input: {
        email: string;
      };
      output: {
        message: string;
      };
      meta: object;
      errorShape: import('@trpc/server').TRPCDefaultErrorShape;
    }>;
    resetPassword: import('@trpc/server').TRPCMutationProcedure<{
      input: {
        token: string;
        password: string;
      };
      output: {
        success: boolean;
      };
      meta: object;
      errorShape: import('@trpc/server').TRPCDefaultErrorShape;
    }>;
  }>
>;
