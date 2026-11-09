import { z } from 'zod';
import {
  createPostInputSchema,
  updatePostInputSchema,
} from '@pipeline/contracts';
import { router, publicProcedure, contentManagerProcedure } from '@/trpc/init';
import type { BlogService } from './blog.service';

export function createBlogRouter(blogService: BlogService) {
  return router({
    list: publicProcedure
      .input(z.object({ locale: z.string().optional() }).optional())
      .query(({ input }) => blogService.findAll(input)),

    bySlug: publicProcedure
      .input(z.object({ slug: z.string(), locale: z.string().optional() }))
      .query(({ input }) => blogService.findOneBySlug(input.slug, input.locale)),

    adminList: contentManagerProcedure.query(() => blogService.findAllAdmin()),

    adminById: contentManagerProcedure
      .input(z.object({ id: z.string() }))
      .query(({ input }) => blogService.findOne(input.id)),

    create: contentManagerProcedure
      .input(createPostInputSchema)
      .mutation(({ ctx, input }) => blogService.create(input, ctx.user.id)),

    update: contentManagerProcedure
      .input(z.object({ id: z.string(), data: updatePostInputSchema }))
      .mutation(({ input }) => blogService.update(input.id, input.data)),

    publish: contentManagerProcedure
      .input(z.object({ id: z.string() }))
      .mutation(({ input }) => blogService.publish(input.id)),

    archive: contentManagerProcedure
      .input(z.object({ id: z.string() }))
      .mutation(({ input }) => blogService.archive(input.id)),

    remove: contentManagerProcedure
      .input(z.object({ id: z.string() }))
      .mutation(({ input }) => blogService.remove(input.id)),
  });
}