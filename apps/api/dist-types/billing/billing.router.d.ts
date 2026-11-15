import type { BillingService } from './billing.service';
export declare const createBillingRouter: (
  billingService: BillingService,
) => import('@trpc/server').TRPCBuiltRouter<
  {
    ctx: import('../trpc/context').TrpcContext;
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
