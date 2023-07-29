import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientModule } from '@modules/client';
import { MailModule, QueueItem } from '@modules/mail';
import { SettingModule } from '@modules/setting';
import { DocumentController } from './document.controller';
import { Document, Invoice, Offer } from './document.entity';
import { ScheduleModule } from '@nestjs/schedule';
import {
  DocumentService,
  OfferService,
  InvoiceService,
  FileService,
} from './services';
import { CustomCacheService } from '@modules/common';
import { CacheKeys, ProvideCacheKey } from '@utils';
import { MailCronJob } from './mail.cron';

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
