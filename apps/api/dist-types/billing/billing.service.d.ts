import { ConfigService } from '@nestjs/config';
import { Plan } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import type { TBillingCycle } from '@pipeline/contracts';
export declare class BillingService {
    private prisma;
    private configService;
    private readonly logger;
    private stripe;
    constructor(prisma: PrismaService, configService: ConfigService);
    private getPriceId;
    getSubscriptionByUserId(userId: string): Promise<{
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
    } | {
        plan: "FREE";
        planStatus: string;
        currentPeriodStart: Date;
        currentPeriodEnd: Date;
        cancelAtPeriodEnd: boolean;
    }>;
    createCheckoutSession(userId: string, plan: Plan, cycle?: TBillingCycle): Promise<{
        url: string | null;
    }>;
    createBillingPortalSession(userId: string): Promise<{
        url: string;
    }>;
    handleWebhook(signature: string, payload: Buffer): Promise<{
        received: boolean;
    }>;
    private processSuccessfulCheckout;
    syncCheckoutSession(userId: string, sessionId: string): Promise<{
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
    } | {
        plan: "FREE";
        planStatus: string;
        currentPeriodStart: Date;
        currentPeriodEnd: Date;
        cancelAtPeriodEnd: boolean;
    }>;
    getTransactionsByUserId(userId: string): Promise<{
        plan: import("@prisma/client").$Enums.Plan;
        id: string;
        status: import("@prisma/client").$Enums.TransactionStatus;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        invoiceId: string | null;
        providerTxId: string | null;
        amount: number;
        currency: string;
        invoiceUrl: string | null;
    }[]>;
    getInvoiceFilepath(userId: string, transactionId: string): Promise<string>;
    cancelSubscription(userId: string): Promise<{
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
    }>;
}
