import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { ConfigService } from '@config';
import { ConfigModule } from '@config';
import { SettingModule } from '@modules/setting';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QueueItem } from '@modules/document/queue.entity';

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
