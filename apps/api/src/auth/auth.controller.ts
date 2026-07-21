import { Controller, Post, Get, Body, UseGuards, Req, Res, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
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
import type { TUserSafe, IOauthUser } from './types/auth.types';

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
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, description: 'User successfully registered and tokens set in cookies.' })
  @ApiResponse({ status: 400, description: 'Bad request (validation failed or email taken).' })
  async register(
    @Body() dto: RegisterDto,
    @Res({passthrough: true}) res: Response
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
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'user@example.com' },
        password: { type: 'string', example: 'StrongPassword123!' },
      },
      required: ['email', 'password'],
    },
  })
  @ApiResponse({ status: 200, description: 'Login successful or requires 2FA verification.' })
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
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        tempToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
        code: { type: 'string', example: '123456' },
      },
      required: ['tempToken', 'code'],
    },
  })
  @ApiResponse({ status: 200, description: '2FA verified successfully, cookies set.' })
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

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('2fa/generate')
  @ApiOperation({ summary: 'Generate 2FA secret and QR code for authenticator' })
  @ApiResponse({ status: 201, description: 'Returns secret and otpauth url.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async generate2fa(@Req() req: IRequestWithUser) {
    return this.authService.generateTwoFactorSecret(req.user.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('2fa/turn-on')
  @ApiOperation({ summary: 'Verify code and enable 2FA for account' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        code: { type: 'string', example: '123456' },
      },
      required: ['code'],
    },
  })
  @ApiResponse({ status: 200, description: '2FA successfully enabled.' })
  @ApiResponse({ status: 400, description: 'Invalid verification code.' })
  async turnOn2fa(
    @Req() req: IRequestWithUser,
    @Body('code') code: string
  ) {
    return this.authService.turnOnTwoFactor(req.user.id, code);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('2fa/turn-off')
  @ApiOperation({ summary: 'Disable 2FA for account' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        code: { type: 'string', example: '123456' },
      },
      required: ['code'],
    },
  })
  @ApiResponse({ status: 200, description: '2FA successfully disabled.' })
  @ApiResponse({ status: 400, description: 'Invalid verification code.' })
  async turnOff2fa(
    @Req() req: IRequestWithUser,
    @Body('code') code: string
  ) {
    return this.authService.turnOffTwoFactor(req.user.id, code);
  }

  @Get('google')
  @UseGuards(GoogleOauthGuard)
  @ApiOperation({ summary: 'Redirect to Google OAuth authentication page' })
  @ApiResponse({ status: 302, description: 'Redirects to Google.' })
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(GoogleOauthGuard)
  @ApiOperation({ summary: 'Google OAuth callback endpoint' })
  @ApiResponse({ status: 302, description: 'Redirects to frontend client URL with session cookies.' })
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
  @ApiOperation({ summary: 'Redirect to GitHub OAuth authentication page' })
  @ApiResponse({ status: 302, description: 'Redirects to GitHub.' })
  async githubAuth() {}

  @Get('github/callback')
  @UseGuards(GithubOauthGuard)
  @ApiOperation({ summary: 'GitHub OAuth callback endpoint' })
  @ApiResponse({ status: 302, description: 'Redirects to frontend client URL with session cookies.' })
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
  @ApiOperation({ summary: 'Refresh access and refresh tokens using cookie' })
  @ApiResponse({ status: 200, description: 'Tokens successfully refreshed.' })
  @ApiResponse({ status: 401, description: 'Invalid or missing refresh token.' })
  async refresh(
    @Req() req: IRequestWithUser,
    @Res({passthrough: true}) res: Response
  ): Promise<{ success: boolean }> {
    const tokens = await this.authService.generateTokens(req.user.id);
    this.setTokenCookies(res, tokens.accessToken, tokens.refreshToken);
    return {success: true};
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiOperation({ summary: 'Get current authorized user info' })
  @ApiResponse({ status: 200, description: 'Returns safe user object.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  getMe(
    @Req() req: IRequestWithUser,
    @Res({passthrough: true}) res: Response
  ): TUserSafe {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    return req.user;
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout user and clear auth cookies' })
  @ApiResponse({ status: 201, description: 'Cookies cleared successfully.' })
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
  @ApiOperation({ summary: 'Request password reset email' })
  @ApiBody({ type: RecoveryDto })
  @ApiResponse({ status: 200, description: 'Password reset link sent message.' })
  async recovery(@Body() dto: RecoveryDto): Promise<{ message: string }> {
    await this.authService.recovery(dto);
    return {message: 'If the email exists, a reset link has been sent.'};
  }

  @HttpCode(HttpStatus.OK)
  @Post('reset-password')
  @ApiOperation({ summary: 'Reset account password using token from email' })
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponse({ status: 200, description: 'Password successfully updated.' })
  @ApiResponse({ status: 400, description: 'Invalid or expired token.' })
  async resetPassword(@Body() dto: ResetPasswordDto): Promise<{ success: boolean }> {
    await this.authService.resetPassword(dto);
    return {success: true};
  }
}