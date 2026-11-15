import type { AuthService } from '../auth/auth.service.js';
import type { AiService } from '../ai/ai.service.js';
import type { BillingService } from '../billing/billing.service.js';
import type { PipelinesService } from '../pipelines/pipelines.service.js';
import type { ProfileService } from '../profile/profile.service.js';
import type { UsersService } from '../users/users.service.js';
import type { DatabaseNodesService } from '../database-nodes/database-nodes.service.js';
import type { ExecutionsService } from '../executions/executions.service.js';
import type { JobsService } from '../jobs/jobs.service.js';
import type { MailService } from '../mail/mail.service.js';
import type { ApplicationsService } from '../applications/applications.service.js';
export interface IRouterServices {
  authService: AuthService;
  billingService: BillingService;
  pipelinesService: PipelinesService;
  profileService: ProfileService;
  usersService: UsersService;
  aiService: AiService;
  databaseNodesService: DatabaseNodesService;
  executionsService: ExecutionsService;
  jobsService: JobsService;
  mailService: MailService;
  applicationsService: ApplicationsService;
}
export declare const createAppRouter: (
  services: IRouterServices,
) => import('@trpc/server').TRPCBuiltRouter<
  {
    ctx: import('./context').TrpcContext;
    meta: object;
    errorShape: import('@trpc/server').TRPCDefaultErrorShape;
    transformer: false;
  },
  import('@trpc/server').TRPCDecorateCreateRouterOptions<{
    auth: import('@trpc/server').TRPCBuiltRouter<
      {
        ctx: import('./context').TrpcContext;
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
                  import('../auth/types/auth.types').TUserSafe,
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
            import('../auth/types/auth.types').TUserSafe,
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
            import('../auth/types/auth.types').TUserSafe,
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
    users: import('@trpc/server').TRPCBuiltRouter<
      {
        ctx: import('./context').TrpcContext;
        meta: object;
        errorShape: import('@trpc/server').TRPCDefaultErrorShape;
        transformer: false;
      },
      import('@trpc/server').TRPCDecorateCreateRouterOptions<{
        updatePassword: import('@trpc/server').TRPCMutationProcedure<{
          input: {
            newPassword: string;
            currentPassword?: string | undefined;
          };
          output: {
            success: boolean;
          };
          meta: object;
          errorShape: import('@trpc/server').TRPCDefaultErrorShape;
        }>;
        remove: import('@trpc/server').TRPCMutationProcedure<{
          input: void;
          output: {
            success: boolean;
          };
          meta: object;
          errorShape: import('@trpc/server').TRPCDefaultErrorShape;
        }>;
        setCurrentPipeline: import('@trpc/server').TRPCMutationProcedure<{
          input: {
            id: string;
            name?: string | undefined;
            description?: string | null | undefined;
            status?: 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'ARCHIVED' | null | undefined;
            lastRunAt?: string | Date | null | undefined;
            lastRunStatus?: 'SUCCESS' | 'FAILED' | 'RUNNING' | null | undefined;
            screenshotUrl?: string | null | undefined;
          };
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
          >;
          meta: object;
          errorShape: import('@trpc/server').TRPCDefaultErrorShape;
        }>;
      }>
    >;
    billing: import('@trpc/server').TRPCBuiltRouter<
      {
        ctx: import('./context').TrpcContext;
        meta: object;
        errorShape: import('@trpc/server').TRPCDefaultErrorShape;
        transformer: false;
      },
      import('@trpc/server').TRPCDecorateCreateRouterOptions<{
        subscription: import('@trpc/server').TRPCQueryProcedure<{
          input: void;
          output:
            | {
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
              }
            | {
                plan: 'FREE';
                planStatus: string;
                currentPeriodStart: Date;
                currentPeriodEnd: Date;
                cancelAtPeriodEnd: boolean;
              };
          meta: object;
          errorShape: import('@trpc/server').TRPCDefaultErrorShape;
        }>;
        transactions: import('@trpc/server').TRPCQueryProcedure<{
          input: void;
          output: {
            plan: import('@prisma/client').$Enums.Plan;
            id: string;
            status: import('@prisma/client').$Enums.TransactionStatus;
            userId: string;
            createdAt: Date;
            updatedAt: Date;
            invoiceId: string | null;
            providerTxId: string | null;
            amount: number;
            currency: string;
            invoiceUrl: string | null;
          }[];
          meta: object;
          errorShape: import('@trpc/server').TRPCDefaultErrorShape;
        }>;
        checkout: import('@trpc/server').TRPCMutationProcedure<{
          input: {
            plan: 'PRO';
            cycle: 'monthly' | 'yearly';
          };
          output: {
            url: string | null;
          };
          meta: object;
          errorShape: import('@trpc/server').TRPCDefaultErrorShape;
        }>;
        cancel: import('@trpc/server').TRPCMutationProcedure<{
          input: void;
          output: {
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
          };
          meta: object;
          errorShape: import('@trpc/server').TRPCDefaultErrorShape;
        }>;
      }>
    >;
    pipelines: import('@trpc/server').TRPCBuiltRouter<
      {
        ctx: import('./context').TrpcContext;
        meta: object;
        errorShape: import('@trpc/server').TRPCDefaultErrorShape;
        transformer: false;
      },
      import('@trpc/server').TRPCDecorateCreateRouterOptions<{
        list: import('@trpc/server').TRPCQueryProcedure<{
          input: void;
          output: {
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
          }[];
          meta: object;
          errorShape: import('@trpc/server').TRPCDefaultErrorShape;
        }>;
        remove: import('@trpc/server').TRPCMutationProcedure<{
          input: {
            id: string;
          };
          output: {
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
          };
          meta: object;
          errorShape: import('@trpc/server').TRPCDefaultErrorShape;
        }>;
        update: import('@trpc/server').TRPCMutationProcedure<{
          input: {
            id: string;
            name?: string | undefined;
            description?: string | null | undefined;
            status?: 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'ARCHIVED' | undefined;
            lastRunAt?: unknown;
            lastRunStatus?: string | null | undefined;
            graphData?:
              | {
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
                }
              | undefined;
            screenshotBase64?: string | null | undefined;
            screenshotUrl?: string | null | undefined;
          };
          output: {
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
          };
          meta: object;
          errorShape: import('@trpc/server').TRPCDefaultErrorShape;
        }>;
      }>
    >;
    executions: import('@trpc/server').TRPCBuiltRouter<
      {
        ctx: import('./context').TrpcContext;
        meta: object;
        errorShape: import('@trpc/server').TRPCDefaultErrorShape;
        transformer: false;
      },
      import('@trpc/server').TRPCDecorateCreateRouterOptions<{
        create: import('@trpc/server').TRPCMutationProcedure<{
          input: {
            pipelineId: string;
            userId: string;
            id?: string | null | undefined;
            status?: 'SUCCESS' | 'FAILED' | 'RUNNING' | 'CANCELED' | undefined;
            triggeredBy?: 'MANUAL' | 'WEBHOOK' | 'CRON' | 'API' | undefined;
            startedAt?: string | Date | undefined;
            finishedAt?: string | Date | null | undefined;
            durationMs?: number | null | undefined;
            nodesExecuted?: number | undefined;
            logs?:
              | Record<
                  string,
                  {
                    [x: string]: unknown;
                    timestamp: number;
                    type: 'error' | 'success' | 'info';
                    message: string;
                    id?: string | undefined;
                    nodeId?: string | undefined;
                    order?: number | undefined;
                  }
                >
              | null
              | undefined;
            createdAt?: string | Date | null | undefined;
          };
          output: {
            pipeline: {
              id: string;
              name: string;
            };
          } & {
            id: string;
            pipelineId: string;
            status: import('@prisma/client').$Enums.ExecutionStatus;
            userId: string;
            createdAt: Date;
            updatedAt: Date;
            triggeredBy: import('@prisma/client').$Enums.TriggerType;
            startedAt: Date;
            finishedAt: Date | null;
            durationMs: number | null;
            nodesExecuted: number;
            logs: import('@prisma/client/runtime/client').JsonValue | null;
          } & {
            durationFormatted: string | null;
          };
          meta: object;
          errorShape: import('@trpc/server').TRPCDefaultErrorShape;
        }>;
        list: import('@trpc/server').TRPCQueryProcedure<{
          input:
            | {
                pipelineId?: string | undefined;
                page?: number | undefined;
                limit?: number | undefined;
                search?: string | undefined;
                status?: string | undefined;
              }
            | undefined;
          output: {
            items: ({
              pipeline: {
                id: string;
                name: string;
              };
            } & {
              id: string;
              pipelineId: string;
              status: import('@prisma/client').$Enums.ExecutionStatus;
              userId: string;
              createdAt: Date;
              updatedAt: Date;
              triggeredBy: import('@prisma/client').$Enums.TriggerType;
              startedAt: Date;
              finishedAt: Date | null;
              durationMs: number | null;
              nodesExecuted: number;
              logs: import('@prisma/client/runtime/client').JsonValue | null;
            } & {
              durationFormatted: string | null;
            })[];
            total: number;
            page: number;
            limit: number;
            totalPages: number;
          };
          meta: object;
          errorShape: import('@trpc/server').TRPCDefaultErrorShape;
        }>;
        getById: import('@trpc/server').TRPCQueryProcedure<{
          input: {
            id: string;
          };
          output: {
            pipeline: {
              id: string;
              name: string;
            };
          } & {
            id: string;
            pipelineId: string;
            status: import('@prisma/client').$Enums.ExecutionStatus;
            userId: string;
            createdAt: Date;
            updatedAt: Date;
            triggeredBy: import('@prisma/client').$Enums.TriggerType;
            startedAt: Date;
            finishedAt: Date | null;
            durationMs: number | null;
            nodesExecuted: number;
            logs: import('@prisma/client/runtime/client').JsonValue | null;
          } & {
            durationFormatted: string | null;
          };
          meta: object;
          errorShape: import('@trpc/server').TRPCDefaultErrorShape;
        }>;
        update: import('@trpc/server').TRPCMutationProcedure<{
          input: {
            id: string;
            data: {
              status?: 'SUCCESS' | 'FAILED' | 'RUNNING' | 'CANCELED' | undefined;
              finishedAt?: string | Date | null | undefined;
              durationMs?: number | null | undefined;
              nodesExecuted?: number | undefined;
              logs?:
                | Record<
                    string,
                    {
                      [x: string]: unknown;
                      timestamp: number;
                      type: 'error' | 'success' | 'info';
                      message: string;
                      id?: string | undefined;
                      nodeId?: string | undefined;
                      order?: number | undefined;
                    }
                  >
                | null
                | undefined;
            };
          };
          output: {
            id: string;
            pipelineId: string;
            status: import('@prisma/client').$Enums.ExecutionStatus;
            userId: string;
            createdAt: Date;
            updatedAt: Date;
            triggeredBy: import('@prisma/client').$Enums.TriggerType;
            startedAt: Date;
            finishedAt: Date | null;
            durationMs: number | null;
            nodesExecuted: number;
            logs: import('@prisma/client/runtime/client').JsonValue | null;
          } & {
            durationFormatted: string | null;
          };
          meta: object;
          errorShape: import('@trpc/server').TRPCDefaultErrorShape;
        }>;
        remove: import('@trpc/server').TRPCMutationProcedure<{
          input: {
            id: string;
          };
          output: {
            id: string;
            pipelineId: string;
            status: import('@prisma/client').$Enums.ExecutionStatus;
            userId: string;
            createdAt: Date;
            updatedAt: Date;
            triggeredBy: import('@prisma/client').$Enums.TriggerType;
            startedAt: Date;
            finishedAt: Date | null;
            durationMs: number | null;
            nodesExecuted: number;
            logs: import('@prisma/client/runtime/client').JsonValue | null;
          };
          meta: object;
          errorShape: import('@trpc/server').TRPCDefaultErrorShape;
        }>;
      }>
    >;
    databaseNodes: import('@trpc/server').TRPCBuiltRouter<
      {
        ctx: import('./context').TrpcContext;
        meta: object;
        errorShape: import('@trpc/server').TRPCDefaultErrorShape;
        transformer: false;
      },
      import('@trpc/server').TRPCDecorateCreateRouterOptions<{
        createRecord: import('@trpc/server').TRPCMutationProcedure<{
          input: {
            pipelineId: string | null;
            nodeId: string;
            query: string | null;
            params: Record<string, unknown> | null;
            data: unknown;
            status: string | null;
            userId: string | null;
            id?: string | null | undefined;
            createdAt?: string | Date | null | undefined;
            updatedAt?: string | Date | null | undefined;
          };
          output: {
            params: import('@prisma/client/runtime/client').JsonValue | null;
            id: string;
            pipelineId: string | null;
            nodeId: string;
            query: string | null;
            data: import('@prisma/client/runtime/client').JsonValue | null;
            status: string | null;
            userId: string | null;
            createdAt: Date;
            updatedAt: Date;
          };
          meta: object;
          errorShape: import('@trpc/server').TRPCDefaultErrorShape;
        }>;
        getByNodeId: import('@trpc/server').TRPCQueryProcedure<{
          input: {
            nodeId: string;
          };
          output: {
            params: import('@prisma/client/runtime/client').JsonValue | null;
            id: string;
            pipelineId: string | null;
            nodeId: string;
            query: string | null;
            data: import('@prisma/client/runtime/client').JsonValue | null;
            status: string | null;
            userId: string | null;
            createdAt: Date;
            updatedAt: Date;
          }[];
          meta: object;
          errorShape: import('@trpc/server').TRPCDefaultErrorShape;
        }>;
        getByPipelineId: import('@trpc/server').TRPCQueryProcedure<{
          input: {
            pipelineId: string;
          };
          output: {
            params: import('@prisma/client/runtime/client').JsonValue | null;
            id: string;
            pipelineId: string | null;
            nodeId: string;
            query: string | null;
            data: import('@prisma/client/runtime/client').JsonValue | null;
            status: string | null;
            userId: string | null;
            createdAt: Date;
            updatedAt: Date;
          }[];
          meta: object;
          errorShape: import('@trpc/server').TRPCDefaultErrorShape;
        }>;
      }>
    >;
    jobs: import('@trpc/server').TRPCBuiltRouter<
      {
        ctx: import('./context').TrpcContext;
        meta: object;
        errorShape: import('@trpc/server').TRPCDefaultErrorShape;
        transformer: false;
      },
      import('@trpc/server').TRPCDecorateCreateRouterOptions<{
        list: import('@trpc/server').TRPCQueryProcedure<{
          input:
            | {
                locale?: string | undefined;
                department?: string | undefined;
              }
            | undefined;
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
          })[];
          meta: object;
          errorShape: import('@trpc/server').TRPCDefaultErrorShape;
        }>;
        bySlug: import('@trpc/server').TRPCQueryProcedure<{
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
          meta: object;
          errorShape: import('@trpc/server').TRPCDefaultErrorShape;
        }>;
        adminList: import('@trpc/server').TRPCQueryProcedure<{
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
          })[];
          meta: object;
          errorShape: import('@trpc/server').TRPCDefaultErrorShape;
        }>;
        adminById: import('@trpc/server').TRPCQueryProcedure<{
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
          meta: object;
          errorShape: import('@trpc/server').TRPCDefaultErrorShape;
        }>;
        create: import('@trpc/server').TRPCMutationProcedure<{
          input: {
            slug: string;
            department: 'ENGINEERING' | 'DESIGN' | 'RESEARCH' | 'OPERATIONS';
            level: 'JUNIOR' | 'MID' | 'SENIOR' | 'LEAD';
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
            type?: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP' | undefined;
            icon?: string | undefined;
            status?: 'DRAFT' | 'ARCHIVED' | 'PUBLISHED' | undefined;
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
          meta: object;
          errorShape: import('@trpc/server').TRPCDefaultErrorShape;
        }>;
        update: import('@trpc/server').TRPCMutationProcedure<{
          input: {
            id: string;
            data: {
              slug?: string | undefined;
              department?: 'ENGINEERING' | 'DESIGN' | 'RESEARCH' | 'OPERATIONS' | undefined;
              level?: 'JUNIOR' | 'MID' | 'SENIOR' | 'LEAD' | undefined;
              type?: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP' | undefined;
              location?: string | undefined;
              icon?: string | null | undefined;
              status?: 'DRAFT' | 'ARCHIVED' | 'PUBLISHED' | undefined;
              translations?:
                | {
                    locale: string;
                    title: string;
                    description: string;
                    responsibilities?: string[] | undefined;
                    requirements?: string[] | undefined;
                    metaTitle?: string | undefined;
                    metaDescription?: string | undefined;
                  }[]
                | undefined;
            };
          };
          output:
            | ({
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
              })
            | null;
          meta: object;
          errorShape: import('@trpc/server').TRPCDefaultErrorShape;
        }>;
        publish: import('@trpc/server').TRPCMutationProcedure<{
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
          meta: object;
          errorShape: import('@trpc/server').TRPCDefaultErrorShape;
        }>;
        archive: import('@trpc/server').TRPCMutationProcedure<{
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
          meta: object;
          errorShape: import('@trpc/server').TRPCDefaultErrorShape;
        }>;
        remove: import('@trpc/server').TRPCMutationProcedure<{
          input: {
            id: string;
          };
          output: {
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
          meta: object;
          errorShape: import('@trpc/server').TRPCDefaultErrorShape;
        }>;
        upsertTranslation: import('@trpc/server').TRPCMutationProcedure<{
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
          errorShape: import('@trpc/server').TRPCDefaultErrorShape;
        }>;
        removeTranslation: import('@trpc/server').TRPCMutationProcedure<{
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
          errorShape: import('@trpc/server').TRPCDefaultErrorShape;
        }>;
        incrementViews: import('@trpc/server').TRPCMutationProcedure<{
          input: {
            id: string;
          };
          output: {
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
          meta: object;
          errorShape: import('@trpc/server').TRPCDefaultErrorShape;
        }>;
        incrementApplications: import('@trpc/server').TRPCMutationProcedure<{
          input: {
            id: string;
          };
          output: {
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
          meta: object;
          errorShape: import('@trpc/server').TRPCDefaultErrorShape;
        }>;
      }>
    >;
    mail: import('@trpc/server').TRPCBuiltRouter<
      {
        ctx: import('./context').TrpcContext;
        meta: object;
        errorShape: import('@trpc/server').TRPCDefaultErrorShape;
        transformer: false;
      },
      import('@trpc/server').TRPCDecorateCreateRouterOptions<{
        sendInquiry: import('@trpc/server').TRPCMutationProcedure<{
          input: {
            name: string;
            email: string;
            company: string;
            position: string;
            message: string;
            type?: 'demo' | 'review' | 'contact' | 'glitch' | undefined;
          };
          output: {
            success: boolean;
          };
          meta: object;
          errorShape: import('@trpc/server').TRPCDefaultErrorShape;
        }>;
      }>
    >;
    applications: import('@trpc/server').TRPCBuiltRouter<
      {
        ctx: import('./context').TrpcContext;
        meta: object;
        errorShape: import('@trpc/server').TRPCDefaultErrorShape;
        transformer: false;
      },
      import('@trpc/server').TRPCDecorateCreateRouterOptions<{
        list: import('@trpc/server').TRPCQueryProcedure<{
          input:
            | {
                jobId?: string | undefined;
              }
            | undefined;
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
          })[];
          meta: object;
          errorShape: import('@trpc/server').TRPCDefaultErrorShape;
        }>;
        byId: import('@trpc/server').TRPCQueryProcedure<{
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
          };
          meta: object;
          errorShape: import('@trpc/server').TRPCDefaultErrorShape;
        }>;
        remove: import('@trpc/server').TRPCMutationProcedure<{
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
          errorShape: import('@trpc/server').TRPCDefaultErrorShape;
        }>;
      }>
    >;
    profile: import('@trpc/server').TRPCBuiltRouter<
      {
        ctx: import('./context').TrpcContext;
        meta: object;
        errorShape: import('@trpc/server').TRPCDefaultErrorShape;
        transformer: false;
      },
      import('@trpc/server').TRPCDecorateCreateRouterOptions<{
        update: import('@trpc/server').TRPCMutationProcedure<{
          input: {
            firstName?: string | undefined;
            lastName?: string | null | undefined;
            company?: string | null | undefined;
            location?: string | null | undefined;
            jobTitle?: string | null | undefined;
            avatarUrl?: string | null | undefined;
          };
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
          >;
          meta: object;
          errorShape: import('@trpc/server').TRPCDefaultErrorShape;
        }>;
      }>
    >;
    ai: import('@trpc/server').TRPCBuiltRouter<
      {
        ctx: import('./context').TrpcContext;
        meta: object;
        errorShape: import('@trpc/server').TRPCDefaultErrorShape;
        transformer: false;
      },
      import('@trpc/server').TRPCDecorateCreateRouterOptions<{
        test: import('@trpc/server').TRPCMutationProcedure<{
          input: {
            message: string;
            system?: string | undefined;
          };
          output: {
            text: string;
          };
          meta: object;
          errorShape: import('@trpc/server').TRPCDefaultErrorShape;
        }>;
      }>
    >;
    health: import('@trpc/server').TRPCQueryProcedure<{
      input: void;
      output: {
        status: string;
      };
      meta: object;
      errorShape: import('@trpc/server').TRPCDefaultErrorShape;
    }>;
  }>
>;
export type AppRouter = ReturnType<typeof createAppRouter>;
