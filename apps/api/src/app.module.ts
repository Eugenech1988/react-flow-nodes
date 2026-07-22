import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
// import { MailModule } from './mail/mail.module';
import { ProfileModule } from './profile/profile.module';
import { BillingModule } from './billing/billing.module';
import { PipelinesModule } from './pipelines/pipelines.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    ProfileModule,
    BillingModule,
    PipelinesModule,
    // MailModule
  ],
})
export class AppModule {}
