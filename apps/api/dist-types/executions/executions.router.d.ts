import type { ExecutionsService } from './executions.service';
export declare const createExecutionsRouter: (
  executionsService: ExecutionsService,
) => import('@trpc/server').TRPCBuiltRouter<
  {
    ctx: import('../trpc/context').TrpcContext;
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
