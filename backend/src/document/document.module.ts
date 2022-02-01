import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentController } from './document.controller';
import { Document, Invoice, Offer } from './document.entity';
import { DocumentService } from './document.service';

@Module({
  imports: [TypeOrmModule.forFeature([Document, Offer, Invoice])],
  controllers: [DocumentController],
  providers: [DocumentService]
})
export class DocumentModule {}
