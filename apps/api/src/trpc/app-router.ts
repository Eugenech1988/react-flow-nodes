import { TRPCError } from '@trpc/server';
import {
  loginInputSchema,
  planSchema,
  registerInputSchema,
  twoFactorLoginInputSchema,
  updatePasswordInputSchema,
  updatePipelineInputSchema,
  updateProfileInputSchema,
  // twoFactorCodeInputSchema,
  twoFactorTotpOnlySchema,
  twoFactorCodeOrBackupSchema
} from '@pipeline/contracts';
import { AuthService } from '@/auth/auth.service';
import { BillingService } from '@/billing/billing.service';
import { PipelinesService } from '@/pipelines/pipelines.service';
import { ProfileService } from '@/profile/profile.service';
import { UsersService } from '@/users/users.service';
import { protectedProcedure, publicProcedure, router } from '@/trpc/init';

interface RouterServices {
  authService: AuthService;
  billingService: BillingService;
  pipelinesService: PipelinesService;
  profileService: ProfileService;
  usersService: UsersService;
}

function setTokenCookies(res: { cookie: Function }, accessToken: string, refreshToken: string) {
  const secure = process.env.NODE_ENV === 'production';
  const baseOptions = { httpOnly: true, secure, sameSite: 'lax' as const };

  res.cookie('accessToken', accessToken, { ...baseOptions, maxAge: 15 * 60 * 1000 });
  res.cookie('refreshToken', refreshToken, { ...baseOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });
}

function toSafeUser<T extends { password?: unknown; twoFactorSecret?: unknown }>(user: T) {
  const { password: _password, twoFactorSecret: _twoFactorSecret, ...safeUser } = user;
  return safeUser;
}

export function createAppRouter(services: RouterServices) {
  const authRouter = router({
    me: publicProcedure.query(({ ctx }) => (ctx.user ? toSafeUser(ctx.user) : null)),
    login: publicProcedure.input(loginInputSchema).mutation(async ({ ctx, input }) => {
      const user = await services.authService.validateUser(input.email, input.password);
      if (!user) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid credentials' });
      if (user.isTwoFactorEnabled) {
        return { isTwoFactorRequired: true as const, tempToken: services.authService.generateTempToken(user.id) };
      }

      const tokens = await services.authService.generateTokens(user.id);
      setTokenCookies(ctx.res, tokens.accessToken, tokens.refreshToken);
      return { isTwoFactorRequired: false as const, user: toSafeUser(user) };
    }),
    loginWith2fa: publicProcedure.input(twoFactorLoginInputSchema).mutation(async ({ ctx, input }) => {
      const user = await services.authService.authenticateWith2Fa(input.tempToken, input.code);
      const tokens = await services.authService.generateTokens(user.id);
      setTokenCookies(ctx.res, tokens.accessToken, tokens.refreshToken);
      return toSafeUser(user);
    }),
    generate2fa: protectedProcedure.mutation(async ({ ctx }) => {
      return services.authService.generateTwoFactorSecret(ctx.user.id);
    }),
    turnOn2fa: protectedProcedure
      .input(twoFactorTotpOnlySchema)
      .mutation(async ({ ctx, input }) => {
        return services.authService.turnOnTwoFactor(ctx.user.id, input.code);
      }),

    turnOff2fa: protectedProcedure
      .input(twoFactorCodeOrBackupSchema)
      .mutation(async ({ ctx, input }) => {
        return services.authService.turnOffTwoFactor(ctx.user.id, input.code);
      }),
    register: publicProcedure.input(registerInputSchema).mutation(async ({ ctx, input }) => {
      const user = await services.authService.register(input);
      const tokens = await services.authService.generateTokens(user.id);
      setTokenCookies(ctx.res, tokens.accessToken, tokens.refreshToken);
      return toSafeUser(user);
    }),
    logout: publicProcedure.mutation(({ ctx }) => {
      const secure = process.env.NODE_ENV === 'production';
      const options = { httpOnly: true, secure, sameSite: 'lax' as const };
      ctx.res.clearCookie('accessToken', options);
      ctx.res.clearCookie('refreshToken', options);
      return { success: true };
    }),
  });

  const usersRouter = router({
    updatePassword: protectedProcedure.input(updatePasswordInputSchema).mutation(async ({ ctx, input }) => {
      await services.usersService.updatePassword(ctx.user.id, input);
      return { success: true };
    }),
    remove: protectedProcedure.mutation(async ({ ctx }) => {
      await services.usersService.delete(ctx.user.id);
      return { success: true };
    }),
  });

  const billingRouter = router({
    subscription: protectedProcedure.query(({ ctx }) => services.billingService.getSubscriptionByUserId(ctx.user.id)),
    transactions: protectedProcedure.query(({ ctx }) => services.billingService.getTransactionsByUserId(ctx.user.id)),
    checkout: protectedProcedure.input(planSchema).mutation(({ ctx, input }) =>
      services.billingService.createCheckoutSession(ctx.user.id, input),
    ),
    cancel: protectedProcedure.mutation(({ ctx }) => services.billingService.cancelSubscription(ctx.user.id)),
  });

  const pipelinesRouter = router({
    list: protectedProcedure.query(({ ctx }) => services.pipelinesService.findAllByUserId(ctx.user.id)),
    remove: protectedProcedure.input(updatePipelineInputSchema.pick({ id: true })).mutation(({ ctx, input }) =>
      services.pipelinesService.remove(input.id, ctx.user.id),
    ),
  });

  const profileRouter = router({
    update: protectedProcedure.input(updateProfileInputSchema).mutation(({ ctx, input }) =>
      services.profileService.update(ctx.user.id, input),
    ),
  });

  return router({
    auth: authRouter,
    users: usersRouter,
    billing: billingRouter,
    pipelines: pipelinesRouter,
    profile: profileRouter,
    health: publicProcedure.query(() => ({ status: 'ok' })),
  });
}

export type AppRouter = ReturnType<typeof createAppRouter>;