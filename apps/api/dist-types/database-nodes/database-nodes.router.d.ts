import type { DatabaseNodesService } from './database-nodes.service';
export declare const createDatabaseNodesRouter: (
  databaseNodesService: DatabaseNodesService,
) => import('@trpc/server').TRPCBuiltRouter<
  {
    ctx: import('../trpc/context').TrpcContext;
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
