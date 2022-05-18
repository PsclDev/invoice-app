import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { MailService } from './mail.service';
import { ConfigService } from '@config/config.service';
import { ConfigModule } from '@config/config.module';

@Module({
  imports: [
    ConfigModule,
    MailerModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        transport: {
          host: config.mail.host,
          secure: true,
          auth: {
            user: config.mail.user,
            pass: config.mail.pass,
          },
          tls: {
            rejectUnauthorized: false,
          },
        },
        defaults: {
          from: config.mail.from,
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
