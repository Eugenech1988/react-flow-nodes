import { z } from 'zod';
import { updateProfileInputSchema } from '@pipeline/contracts';
import { router, publicProcedure, protectedProcedure } from '@/trpc/init';
import { toSafeUser } from '@/users/users.helpers';

import { createAuthRouter } from '@/auth/auth.router';
import { createUsersRouter } from '@/users/users.router';
import { createBillingRouter } from '@/billing/billing.router';
import { createPipelinesRouter } from '@/pipelines/pipelines.router';
import { createExecutionsRouter } from '@/executions/executions.router';
import { createDatabaseNodesRouter } from '@/database-nodes/database-nodes.router';
import { createJobsRouter } from '@/jobs/jobs.router';
import { createMailRouter } from '@/mail/mail.router';
import { createApplicationsRouter } from '@/applications/applications.router';

import type { AuthService } from '@/auth/auth.service';
import type { AiService } from '@/ai/ai.service';
import type { BillingService } from '@/billing/billing.service';
import type { PipelinesService } from '@/pipelines/pipelines.service';
import type { ProfileService } from '@/profile/profile.service';
import type { UsersService } from '@/users/users.service';
import type { DatabaseNodesService } from '@/database-nodes/database-nodes.service';
import type { ExecutionsService } from '@/executions/executions.service';
import type { JobsService } from '@/jobs/jobs.service';
import type { MailService } from '@/mail/mail.service';
import type { ApplicationsService } from '@/applications/applications.service';

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

export const createAppRouter = (services: IRouterServices) => {
  const profileRouter = router({
    update: protectedProcedure.input(updateProfileInputSchema).mutation(async ({ ctx, input }) => {
      const updatedUser = await services.profileService.update(ctx.user.id, input);
      return toSafeUser(updatedUser);
    }),
  });

  const aiRouter = router({
    test: protectedProcedure
      .input(
        z.object({
          message: z.string(),
          system: z.string().optional(),
        }),
      )
      .mutation(({ input }) => services.aiService.test(input.message, input.system)),
  });

  return router({
    auth: createAuthRouter(services.authService),
    users: createUsersRouter(services.usersService),
    billing: createBillingRouter(services.billingService),
    pipelines: createPipelinesRouter(services.pipelinesService),
    executions: createExecutionsRouter(services.executionsService),
    databaseNodes: createDatabaseNodesRouter(services.databaseNodesService),
    jobs: createJobsRouter(services.jobsService),
    mail: createMailRouter(services.mailService),
    applications: createApplicationsRouter(services.applicationsService),
    profile: profileRouter,
    ai: aiRouter,
    health: publicProcedure.query(() => ({ status: 'ok' })),
  });
};

export type AppRouter = ReturnType<typeof createAppRouter>;
