import { TRPCError, initTRPC } from '@trpc/server';
import type { TrpcContext } from '@/trpc/context';

const t = initTRPC.context<TrpcContext>().create({
  errorFormatter({ shape }) {
    return shape;
  },
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  return next({
    ctx: { user: ctx.user },
  });
});

export const contentManagerProcedure = protectedProcedure.use(({ ctx, next }) => {
  const allowed = ['CONTENT_MANAGER', 'SUPER_ADMIN'];
  if (!allowed.includes(ctx.user.role as string)) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Only content managers can access this resource',
    });
  }
  return next({ ctx });
});

export const superAdminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'SUPER_ADMIN') {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Super admin access required',
    });
  }
  return next({ ctx });
});
