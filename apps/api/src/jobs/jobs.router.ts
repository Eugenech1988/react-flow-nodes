import { z } from 'zod';
import {
  createJobInputSchema,
  updateJobInputSchema,
  upsertJobTranslationInputSchema,
} from '@pipeline/contracts';
import {
  router,
  publicProcedure,
  contentManagerProcedure,
} from '@/trpc/init';
import type { JobsService } from './jobs.service';

export function createJobsRouter(jobsService: JobsService) {
  return router({
    list: publicProcedure
      .input(
        z
          .object({
            locale: z.string().default('en'),
            department: z.string().optional(),
          })
          .optional(),
      )
      .query(({ input }) => jobsService.findAll(input)),

    bySlug: publicProcedure
      .input(z.object({ slug: z.string(), locale: z.string().default('en') }))
      .query(({ input }) => jobsService.findOneBySlug(input.slug, input.locale)),

    adminList: contentManagerProcedure.query(() => jobsService.findAllAdmin()),

    adminById: contentManagerProcedure
      .input(z.object({ id: z.string() }))
      .query(({ input }) => jobsService.findOne(input.id)),

    create: contentManagerProcedure
      .input(createJobInputSchema)
      .mutation(({ ctx, input }) => jobsService.create(input, ctx.user.id)),

    update: contentManagerProcedure
      .input(
        z.object({
          id: z.string(),
          data: updateJobInputSchema,
        }),
      )
      .mutation(({ input }) => jobsService.update(input.id, input.data)),

    publish: contentManagerProcedure
      .input(z.object({ id: z.string() }))
      .mutation(({ input }) => jobsService.publish(input.id)),

    archive: contentManagerProcedure
      .input(z.object({ id: z.string() }))
      .mutation(({ input }) => jobsService.archive(input.id)),

    remove: contentManagerProcedure
      .input(z.object({ id: z.string() }))
      .mutation(({ input }) => jobsService.remove(input.id)),

    upsertTranslation: contentManagerProcedure
      .input(
        z.object({
          jobId: z.string(),
          data: upsertJobTranslationInputSchema,
        }),
      )
      .mutation(({ input }) => jobsService.upsertTranslation(input.jobId, input.data)),

    removeTranslation: contentManagerProcedure
      .input(z.object({ jobId: z.string(), locale: z.string() }))
      .mutation(({ input }) => jobsService.removeTranslation(input.jobId, input.locale)),
  });
}