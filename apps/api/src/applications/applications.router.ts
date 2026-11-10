import { router, contentManagerProcedure } from '@/trpc/init';
import { applicationIdInputSchema, applicationListFilterInputSchema } from '@pipeline/contracts';
import type { ApplicationsService } from './applications.service';

export function createApplicationsRouter(applicationsService: ApplicationsService) {
  return router({
    list: contentManagerProcedure
      .input(applicationListFilterInputSchema)
      .query(({ input }) => applicationsService.findAll(input)),

    byId: contentManagerProcedure
      .input(applicationIdInputSchema)
      .query(({ input }) => applicationsService.findOne(input.id)),

    remove: contentManagerProcedure
      .input(applicationIdInputSchema)
      .mutation(({ input }) => applicationsService.remove(input.id)),
  });
}
