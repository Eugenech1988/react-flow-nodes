import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '@/users/users.module';
import { AuthService } from '@/auth/auth.service';
import { MailService } from '@/mail/mail.service';
import { AuthController } from '@/auth/auth.controller';
import { LocalStrategy } from '@/auth/strategies/local.strategy';
import { JwtRefreshStrategy } from '@/auth/strategies/jwt-refresh.strategy';
import { JwtAccessStrategy } from '@/auth/strategies/jwt-access.strategy';
import { GoogleStrategy } from '@/auth/strategies/google.strategy';
import { GithubStrategy } from '@/auth/strategies/github.strategy';
import { MailModule } from '@/mail/mail.module';

@Module({
  imports: [
    UsersModule,
    MailModule,
    MailModule,
    PassportModule.register({defaultStrategy: 'google'}),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.getOrThrow('JWT_ACCESS_SECRET'),
        signOptions: {
          expiresIn: configService.getOrThrow('JWT_ACCESS_EXPIRES')
        }
      })
    })
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtRefreshStrategy,
    JwtAccessStrategy,
    GoogleStrategy,
    GithubStrategy,
    MailService
  ]
})
export class AuthModule {}