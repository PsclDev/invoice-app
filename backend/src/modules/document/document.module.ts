import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientModule } from '@modules/client';
import { MailModule } from '@modules/mail';
import { SettingModule } from '@modules/setting';
import { DocumentController } from './document.controller';
import { Document, Invoice, Offer } from './document.entity';
import {
  DocumentService,
  OfferService,
  InvoiceService,
  FileService,
} from './services';
import { CustomCacheService } from '@modules/common';
import { CacheKeys, ProvideCacheKey } from '@utils';

@Module({
  imports: [
    CacheModule.register(),
    TypeOrmModule.forFeature([Document, Offer, Invoice]),
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
  ],
})
export class DocumentModule {}
