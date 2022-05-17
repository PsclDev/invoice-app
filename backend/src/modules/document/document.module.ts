import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientModule } from 'modules/client/client.module';
import { MailModule } from 'modules/mail/mail.module';
import { DocumentController } from './document.controller';
import { Document, Invoice, Offer } from './document.entity';
import {
  DocumentService,
  OfferService,
  InvoiceService,
  FileService,
} from './services';

@Module({
  imports: [
    TypeOrmModule.forFeature([Document, Offer, Invoice]),
    ClientModule,
    MailModule,
  ],
  controllers: [DocumentController],
  providers: [DocumentService, OfferService, InvoiceService, FileService],
})
export class DocumentModule {}
