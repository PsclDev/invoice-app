import { CustomCacheService, generateId, updateEntity } from '@helper';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as dayjs from 'dayjs';
import {
  CreateInvoiceDto,
  CreateOfferDto,
  UpdateOfferDto,
} from '@modules/document';
import { Repository } from 'typeorm';
import { Document, Invoice, Offer } from '../document.entity';
import { DocumentService } from './document.service';
import { InvoiceService } from './invoice.service';

@Injectable()
export class OfferService {
  private readonly logger = new Logger(OfferService.name);

  constructor(
    private readonly customCacheService: CustomCacheService<Document>,
    private readonly documentService: DocumentService,
    private readonly invoiceService: InvoiceService,
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,
    @InjectRepository(Invoice)
    private invoiceRepository: Repository<Invoice>,
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
  ) {}

  async getNewOfferNr(): Promise<number> {
    const latestNr: number = await this.documentService.getMaxValue<Offer>(
      this.offerRepository,
      'offerNr',
    );

    return latestNr + 1;
  }

  async createOffer(offerDto: CreateOfferDto): Promise<Document> {
    const offer = await this.offerRepository.save({
      id: generateId<Document>(this.documentRepository),
      ...offerDto,
    });

    await this.customCacheService.addNewDataToCache(offer);

    return offer;
  }

  async updateOffer(id: string, offerDto: UpdateOfferDto) {
    await updateEntity<Offer>(this.offerRepository, id, offerDto);

    const offer = await this.documentService.findById(id);
    await this.customCacheService.updateExistingDataInCache(id, offer);
  }

  async convertOffer(id: string): Promise<Invoice> {
    const offer = await this.offerRepository.findOne({ id });
    if (offer.invoiceId)
      throw new BadRequestException('Invoice for this Offer already exists');

    const createInvoice: CreateInvoiceDto = {
      invoiceNr: await this.invoiceService.getNewInvoiceNr(),
      subTotal: offer.subTotal,
      tax: offer.tax,
      taxRate: offer.taxRate,
      alreadyPaid: 0,
      total: offer.total,
      dueDate: dayjs().add(14, 'day').toDate(),
      clientId: offer.clientId,
      dateOfIssue: new Date(),
      description: offer.description,
    };

    const invoice = await this.invoiceRepository.save({
      id: generateId<Document>(this.documentRepository),
      ...createInvoice,
    });

    this.customCacheService.addNewDataToCache(invoice);

    offer.invoice = invoice;
    await this.offerRepository.save(offer);
    await this.customCacheService.updateExistingDataInCache(id, offer);

    return invoice;
  }
}
