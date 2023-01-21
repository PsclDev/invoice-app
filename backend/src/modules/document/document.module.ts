import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientModule } from '@modules/client/client.module';
import { MailModule } from '@modules/mail/mail.module';
import { DocumentController } from './document.controller';
import { Document, Invoice, Offer } from './document.entity';
import {
  DocumentService,
  OfferService,
  InvoiceService,
  FileService,
} from './services';
import { CacheKeys, CustomCacheService } from '@helper';

@Module({
  imports: [
    CacheModule.register(),
    TypeOrmModule.forFeature([Document, Offer, Invoice]),
    ClientModule,
    MailModule,
  ],
  controllers: [DocumentController],
  providers: [
    {
      provide: 'CACHE_KEY',
      useValue: CacheKeys.DOCUMENT,
    },
    CustomCacheService,
    DocumentService,
    OfferService,
    InvoiceService,
    FileService,
  ],
})
export class DocumentModule {}
