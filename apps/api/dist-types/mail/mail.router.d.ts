import type { MailService } from './mail.service.js';
export declare const createMailRouter: (mailService: MailService) => import("@trpc/server").TRPCBuiltRouter<{
    ctx: import("../trpc/context").TrpcContext;
    meta: object;
    errorShape: import("@trpc/server").TRPCDefaultErrorShape;
    transformer: false;
}, import("@trpc/server").TRPCDecorateCreateRouterOptions<{
    sendInquiry: import("@trpc/server").TRPCMutationProcedure<{
        input: {
            name: string;
            email: string;
            company: string;
            position: string;
            message: string;
            type?: "demo" | "review" | "contact" | "glitch" | undefined;
        };
        output: {
            success: boolean;
        };
        meta: object;
        errorShape: import("@trpc/server").TRPCDefaultErrorShape;
    }>;
}>>;
