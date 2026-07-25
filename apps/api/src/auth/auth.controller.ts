import { Controller, Post, Get, Body, UseGuards, Req, Res, HttpCode, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import type { Response, Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '@/auth/auth.service';
import { RegisterDto } from '@/auth/dtos/register.dto';
import { RecoveryDto } from '@/auth/dtos/recovery.dto';
import { ResetPasswordDto } from '@/auth/dtos/reset-password.dto';
import { LocalAuthGuard } from '@/auth/guards/local-auth.guard';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { GoogleOauthGuard } from '@/auth/guards/google.guard';
import { GithubOauthGuard } from '@/auth/guards/github.guard';
import type { TUserSafe, IOauthUser } from '@/auth/types/auth.types';

interface IRequestWithUser extends Request {
  user: TUserSafe;
}

interface IRequestWithOauthUser extends Request {
  user: IOauthUser;
}

@ApiTags('Auth')
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
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered and logged in.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response
  ): Promise<TUserSafe> {
    const user = await this.authService.register(dto);
    const tokens = await this.authService.generateTokens(user.id);
    this.setTokenCookies(res, tokens.accessToken, tokens.refreshToken);
    return user;
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'Login user with local credentials' })
  @ApiResponse({ status: 200, description: 'Login successful or requires 2FA.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async login(
    @Req() req: IRequestWithUser,
    @Res({ passthrough: true }) res: Response
  ): Promise<TUserSafe | { isTwoFactorRequired: true; tempToken: string }> {
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
  @ApiOperation({ summary: 'Complete login using 2FA code and temporary token' })
  @ApiResponse({ status: 200, description: '2FA verified successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid code or expired temp token.' })
  async loginWith2fa(
    @Body('tempToken') tempToken: string,
    @Body('code') code: string,
    @Res({ passthrough: true }) res: Response
  ): Promise<TUserSafe> {
    const user = await this.authService.authenticateWith2Fa(tempToken, code);
    const tokens = await this.authService.generateTokens(user.id);
    this.setTokenCookies(res, tokens.accessToken, tokens.refreshToken);
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('2fa/generate')
  @ApiOperation({ summary: 'Generate 2FA secret and QR code' })
  @ApiResponse({ status: 201, description: 'Returns secret and QR code.' })
  async generate2fa(@Req() req: IRequestWithUser) {
    return this.authService.generateTwoFactorSecret(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('2fa/turn-on')
  @ApiOperation({ summary: 'Enable 2FA for account' })
  @ApiResponse({ status: 200, description: '2FA successfully enabled.' })
  async turnOn2fa(
    @Req() req: IRequestWithUser,
    @Body('code') code: string
  ) {
    return this.authService.turnOnTwoFactor(req.user.id, code);
  }

  @UseGuards(JwtAuthGuard)
  @Post('2fa/turn-off')
  @ApiOperation({ summary: 'Disable 2FA for account' })
  @ApiResponse({ status: 200, description: '2FA successfully disabled.' })
  async turnOff2fa(
    @Req() req: IRequestWithUser,
    @Body('code') code: string
  ) {
    return this.authService.turnOffTwoFactor(req.user.id, code);
  }

  @Get('google')
  @UseGuards(GoogleOauthGuard)
  @ApiOperation({ summary: 'Login with Google' })
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(GoogleOauthGuard)
  @ApiOperation({ summary: 'Google OAuth callback' })
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
  @ApiOperation({ summary: 'Login with GitHub' })
  async githubAuth() {}

  @Get('github/callback')
  @UseGuards(GithubOauthGuard)
  @ApiOperation({ summary: 'GitHub OAuth callback' })
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
  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token via cookie' })
  @ApiResponse({ status: 200, description: 'Tokens successfully refreshed.' })
  @ApiResponse({ status: 401, description: 'Invalid or missing refresh token.' })
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ): Promise<{ success: boolean }> {
    const refreshToken = req.cookies?.['refreshToken'] || req.headers.authorization?.replace('Bearer ', '');

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token missing');
    }

    const tokens = await this.authService.refreshTokens(refreshToken);
    this.setTokenCookies(res, tokens.accessToken, tokens.refreshToken);
    return { success: true };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiOperation({ summary: 'Get current authorized user' })
  @ApiResponse({ status: 200, description: 'Returns current user info.' })
  getMe(
    @Req() req: IRequestWithUser,
    @Res({ passthrough: true }) res: Response
  ): TUserSafe {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    return req.user;
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  @ApiOperation({ summary: 'Logout user and clear auth cookies' })
  @ApiResponse({ status: 200, description: 'Cookies cleared successfully.' })
  async logout(@Res({ passthrough: true }) res: Response) {
    const isProd = process.env.NODE_ENV === 'production';
    const cookieOptions = {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax' as const
    };

    res.clearCookie('accessToken', cookieOptions);
    res.clearCookie('refreshToken', cookieOptions);

    return { success: true };
  }

  @HttpCode(HttpStatus.OK)
  @Post('recovery')
  @ApiOperation({ summary: 'Request password recovery email' })
  @ApiResponse({ status: 200, description: 'Recovery link generated.' })
  async recovery(@Body() dto: RecoveryDto): Promise<{ message: string }> {
    await this.authService.recovery(dto);
    return { message: 'If the email exists, a reset link has been sent.' };
  }

  @HttpCode(HttpStatus.OK)
  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password using token' })
  @ApiResponse({ status: 200, description: 'Password updated.' })
  @ApiResponse({ status: 400, description: 'Invalid or expired token.' })
  async resetPassword(@Body() dto: ResetPasswordDto): Promise<{ success: boolean }> {
    await this.authService.resetPassword(dto);
    return { success: true };
  }
}