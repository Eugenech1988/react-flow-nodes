import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/adapters/handlebars.adapter';
import { join } from 'node:path';
import { MailService } from './mail.service';
import { existsSync } from 'node:fs';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const port = Number(configService.getOrThrow<number>('MAIL_PORT'));

        const distTemplatesDir = join(__dirname, 'templates');
        const srcTemplatesDir = join(__dirname, 'templates');

        const templatesDir = existsSync(distTemplatesDir)
          ? distTemplatesDir
          : srcTemplatesDir;

        return {
          transport: {
            host: configService.getOrThrow<string>('MAIL_HOST'),
            port,
            secure: port === 465,
            auth: {
              user: configService.getOrThrow<string>('MAIL_USER'),
              pass: configService.getOrThrow<string>('MAIL_PASSWORD'),
            },
          },
          defaults: {
            from: `"No Reply" <${configService.getOrThrow<string>('MAIL_FROM')}>`,
          },
          template: {
            dir: templatesDir,
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}