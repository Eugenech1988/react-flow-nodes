import { TRPCError } from '@trpc/server';
import {
  loginInputSchema,
  registerInputSchema,
  twoFactorTotpOnlySchema,
  twoFactorLoginInputSchema,
  twoFactorCodeOrBackupSchema,
  passwordResetInputSchema,
  requestResetInputSchema,
} from '@pipeline/contracts';
import { router, publicProcedure, protectedProcedure } from '@/trpc/init';
import { toSafeUser } from '@/users/users.helpers';
import { setTokenCookies } from '@/trpc/helpers';
import type { AuthService } from './auth.service';

export function createAuthRouter(authService: AuthService) {
  return router({
    me: publicProcedure.query(({ ctx }) => (ctx.user ? toSafeUser(ctx.user) : null)),

    login: publicProcedure.input(loginInputSchema).mutation(async ({ ctx, input }) => {
      const user = await authService.validateUser(input.email, input.password);
      if (!user) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid credentials' });
      }

      if (user.isTwoFactorEnabled) {
        return {
          isTwoFactorRequired: true as const,
          tempToken: authService.generateTempToken(user.id),
        };
      }

      const tokens = await authService.generateTokens(user.id);
      setTokenCookies(ctx.res, tokens.accessToken, tokens.refreshToken);

      return { isTwoFactorRequired: false as const, user: toSafeUser(user) };
    }),

    loginWith2fa: publicProcedure
      .input(twoFactorLoginInputSchema)
      .mutation(async ({ ctx, input }) => {
        const user = await authService.authenticateWith2Fa(input.tempToken, input.code);
        const tokens = await authService.generateTokens(user.id);
        setTokenCookies(ctx.res, tokens.accessToken, tokens.refreshToken);
        return toSafeUser(user);
      }),

    generate2fa: protectedProcedure.mutation(async ({ ctx }) => {
      return authService.generateTwoFactorSecret(ctx.user.id);
    }),

    turnOn2fa: protectedProcedure
      .input(twoFactorTotpOnlySchema)
      .mutation(async ({ ctx, input }) => {
        return authService.turnOnTwoFactor(ctx.user.id, input.code);
      }),

    turnOff2fa: protectedProcedure
      .input(twoFactorCodeOrBackupSchema)
      .mutation(async ({ ctx, input }) => {
        return authService.turnOffTwoFactor(ctx.user.id, input.code);
      }),

    register: publicProcedure.input(registerInputSchema).mutation(async ({ ctx, input }) => {
      const user = await authService.register(input);
      const tokens = await authService.generateTokens(user.id);
      setTokenCookies(ctx.res, tokens.accessToken, tokens.refreshToken);
      return toSafeUser(user);
    }),

    logout: publicProcedure.mutation(async ({ ctx }) => {
      const refreshToken = ctx.req.cookies?.['refreshToken'];

      if (refreshToken) {
        await authService.logout(refreshToken);
      }

      const secure = process.env.NODE_ENV === 'production';
      const options = { httpOnly: true, secure, sameSite: 'lax' as const };
      ctx.res.clearCookie('accessToken', options);
      ctx.res.clearCookie('refreshToken', options);

      return { success: true };
    }),

    requestPasswordReset: publicProcedure
      .input(requestResetInputSchema)
      .mutation(async ({ input }) => {
        return authService.publicRequestResetPassword(input);
      }),

    resetPassword: publicProcedure.input(passwordResetInputSchema).mutation(async ({ input }) => {
      return authService.publicResetPassword(input);
    }),
  });
}
