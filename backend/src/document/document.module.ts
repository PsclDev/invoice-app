import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientModule } from 'client/client.module';
import { MailModule } from 'mail/mail.module';
import { DocumentController } from './document.controller';
import { Document, Invoice, Offer } from './document.entity';
import { DocumentService } from './document.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Document, Offer, Invoice]),
    ClientModule,
    MailModule,
  ],
  controllers: [DocumentController],
  providers: [DocumentService],
})
export class DocumentModule {}
