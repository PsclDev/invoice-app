import { ConfigService } from '@config';
import { ConfigModule } from '@config';
import { QueueItem } from '@modules/document/queue.entity';
import { SettingModule } from '@modules/setting';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';

import { MailService } from './mail.service';

@Module({
  imports: [
    ConfigModule,
    SettingModule,
    TypeOrmModule.forFeature([QueueItem]),
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
