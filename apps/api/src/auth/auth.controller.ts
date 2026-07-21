import { Controller, Post, Get, Body, UseGuards, Req, Res, HttpCode, HttpStatus } from '@nestjs/common';
import type { Response, Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { RegisterDto } from './dtos/register.dto';
import { RecoveryDto } from './dtos/recovery.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { GoogleOauthGuard } from './guards/google.guard';
import { GithubOauthGuard } from './guards/github.guard';
import type { IUserSafe, IOauthUser } from './types/auth.types';

interface IRequestWithUser extends Request {
  user: IUserSafe;
}

interface IRequestWithOauthUser extends Request {
  user: IOauthUser;
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService
  ) {}

  private setTokenCookies(res: Response, accessToken: string, refreshToken: string) {
    const isProd = process.env.NODE_ENV === 'production';

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
  }

  @Post('register')
  async register(
    @Body() dto: RegisterDto,
    @Res({passthrough: true}) res: Response
  ): Promise<IUserSafe> {
    const user = await this.authService.register(dto);
    const tokens = await this.authService.generateTokens(user.id);
    this.setTokenCookies(res, tokens.accessToken, tokens.refreshToken);
    return user;
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Req() req: IRequestWithUser,
    @Res({ passthrough: true }) res: Response
  ): Promise<IUserSafe | { isTwoFactorRequired: true; tempToken: string }> { // <-- Разрешаем возвращать объект с tempToken
    const user = req.user;

    if (user.isTwoFactorEnabled) {
      const tempToken = this.authService.generateTempToken(user.id);
      return {
        isTwoFactorRequired: true,
        tempToken,
      };
    }

    const tokens = await this.authService.generateTokens(user.id);
    this.setTokenCookies(res, tokens.accessToken, tokens.refreshToken);
    return user;
  }

  @HttpCode(HttpStatus.OK)
  @Post('login-2fa')
  async loginWith2fa(
    @Body('tempToken') tempToken: string,
    @Body('code') code: string,
    @Res({ passthrough: true }) res: Response
  ): Promise<IUserSafe> {
    const user = await this.authService.authenticateWith2Fa(tempToken, code);
    const tokens = await this.authService.generateTokens(user.id);
    this.setTokenCookies(res, tokens.accessToken, tokens.refreshToken);
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('2fa/generate')
  async generate2fa(@Req() req: IRequestWithUser) {
    return this.authService.generateTwoFactorSecret(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('2fa/turn-on')
  async turnOn2fa(
    @Req() req: IRequestWithUser,
    @Body('code') code: string
  ) {
    return this.authService.turnOnTwoFactor(req.user.id, code);
  }

  @UseGuards(JwtAuthGuard)
  @Post('2fa/turn-off')
  async turnOff2fa(
    @Req() req: IRequestWithUser,
    @Body('code') code: string
  ) {
    return this.authService.turnOffTwoFactor(req.user.id, code);
  }

  @Get('google')
  @UseGuards(GoogleOauthGuard)
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(GoogleOauthGuard)
  async googleAuthCallback(
    @Req() req: IRequestWithOauthUser,
    @Res() res: Response
  ) {
    const user = await this.authService.validateOauthUser(req.user);
    const tokens = await this.authService.generateTokens(user.id);
    this.setTokenCookies(res, tokens.accessToken, tokens.refreshToken);

    const clientUrl = this.configService.get<string>('CLIENT_URL') || 'http://localhost:5173';
    return res.redirect(clientUrl);
  }

  @Get('github')
  @UseGuards(GithubOauthGuard)
  async githubAuth() {}

  @Get('github/callback')
  @UseGuards(GithubOauthGuard)
  async githubAuthCallback(
    @Req() req: IRequestWithOauthUser,
    @Res() res: Response
  ) {
    const user = await this.authService.validateOauthUser(req.user);
    const tokens = await this.authService.generateTokens(user.id);
    this.setTokenCookies(res, tokens.accessToken, tokens.refreshToken);

    const clientUrl = this.configService.get<string>('CLIENT_URL') || 'http://localhost:5173';
    return res.redirect(clientUrl);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  async refresh(
    @Req() req: IRequestWithUser,
    @Res({passthrough: true}) res: Response
  ): Promise<{ success: boolean }> {
    const tokens = await this.authService.generateTokens(req.user.id);
    this.setTokenCookies(res, tokens.accessToken, tokens.refreshToken);
    return {success: true};
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(
    @Req() req: IRequestWithUser,
    @Res({passthrough: true}) res: Response
  ): IUserSafe {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    return req.user;
  }

  @Post('logout')
  async logout(@Res({passthrough: true}) res: Response) {
    const isProd = process.env.NODE_ENV === 'production';
    const cookieOptions = {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax' as const
    };

    res.clearCookie('accessToken', cookieOptions);
    res.clearCookie('refreshToken', cookieOptions);

    return {success: true};
  }

  @HttpCode(HttpStatus.OK)
  @Post('recovery')
  async recovery(@Body() dto: RecoveryDto): Promise<{ message: string }> {
    await this.authService.recovery(dto);
    return {message: 'If the email exists, a reset link has been sent.'};
  }

  @HttpCode(HttpStatus.OK)
  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto): Promise<{ success: boolean }> {
    await this.authService.resetPassword(dto);
    return {success: true};
  }
}