import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { ConfigService } from '@config';
import { ConfigModule } from '@config';
import { SettingModule } from '@modules/setting';

@Module({
  imports: [
    ConfigModule,
    SettingModule,
    MailerModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        transport: {
          logger: config.mail.logging,
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
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
