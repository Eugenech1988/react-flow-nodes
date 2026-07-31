import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '@/prisma/prisma.module';
import { AuthModule } from '@/auth/auth.module';
import { UsersModule } from '@/users/users.module';
import { ProfileModule } from '@/profile/profile.module';
import { BillingModule } from '@/billing/billing.module';
import { PipelinesModule } from '@/pipelines/pipelines.module';
import { InngestModule } from '@/inngest/inngest.module';
import { AiModule } from './ai/ai.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    ProfileModule,
    BillingModule,
    PipelinesModule,
    InngestModule,
    AiModule,
  ],
})
export class AppModule {}
