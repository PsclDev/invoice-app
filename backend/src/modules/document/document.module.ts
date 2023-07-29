import { ClientModule } from '@modules/client';
import { CustomCacheService } from '@modules/common';
import { MailModule, QueueItem } from '@modules/mail';
import { SettingModule } from '@modules/setting';
import { CacheModule, Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheKeys, ProvideCacheKey } from '@utils';

import { DocumentController } from './document.controller';
import { Document, Invoice, Offer } from './document.entity';
import { MailCronJob } from './mail.cron';
import {
  DocumentService,
  FileService,
  InvoiceService,
  OfferService,
} from './services';

@Module({
  imports: [
    CacheModule.register(),
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([Document, Offer, Invoice, QueueItem]),
    ClientModule,
    MailModule,
    SettingModule,
  ],
  controllers: [DocumentController],
  providers: [
    ProvideCacheKey(CacheKeys.DOCUMENT),
    CustomCacheService,
    DocumentService,
    OfferService,
    InvoiceService,
    FileService,
    MailCronJob,
  ],
  exports: [DocumentService, OfferService, InvoiceService],
})
export class DocumentModule {}
