import { generateId, updateEntity } from '@helper';
import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateInvoiceDto,
  CreateOfferDto,
  UpdateInvoiceDto,
  UpdateOfferDto,
} from './document.dto';
import { Document, Invoice, Offer } from './document.entity';

@Injectable()
export class DocumentService {
  private readonly logger = new Logger(DocumentService.name);

  constructor(
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,
    @InjectRepository(Invoice)
    private invoiceRepository: Repository<Invoice>,
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
  ) {}

  async findAll(): Promise<Document[]> {
    return await this.documentRepository.find();
  }

  async findById(id: string): Promise<Document> {
    return await this.documentRepository.findOne({ id });
  }

  async createInvoice(invoiceDto: CreateInvoiceDto): Promise<Document> {
    const existingInvoice = await this.invoiceRepository.findOne({
      invoiceNr: invoiceDto.invoiceNr,
    });
    if (existingInvoice) {
      this.logger.warn(
        `Invoice with nr. ${invoiceDto.invoiceNr} already exists`,
      );
      throw new HttpException('Invoice already exists', HttpStatus.CONFLICT);
    }

    const invoice: Invoice = {
      id: generateId<Document>(this.documentRepository),
      invoiceNr: invoiceDto.invoiceNr,
      subTotal: invoiceDto.subTotal,
      tax: invoiceDto.tax,
      alreadyPaid: invoiceDto.alreadyPaid,
      total: invoiceDto.total,
      dueDate: invoiceDto.dueDate,
      client: invoiceDto.client,
      dateOfIssue: invoiceDto.dateOfIssue,
      description: invoiceDto.description,
    };

    return await this.invoiceRepository.save(invoice);
  }

  async updateInvoice(id: string, invoiceDto: UpdateInvoiceDto) {
    await updateEntity<Invoice>(this.invoiceRepository, id, invoiceDto);
  }

  async createOffer(offerDto: CreateOfferDto): Promise<Document> {
    const offer: Offer = {
      id: generateId<Document>(this.documentRepository),
      subTotal: offerDto.subTotal,
      tax: offerDto.tax,
      total: offerDto.total,
      client: offerDto.client,
      dateOfIssue: offerDto.dateOfIssue,
      description: offerDto.description,
    };

    return await this.offerRepository.save(offer);
  }

  async updateOffer(id: string, offerDto: UpdateOfferDto) {
    await updateEntity<Offer>(this.offerRepository, id, offerDto);
  }

  async delete(id: string) {
    const result = await this.documentRepository.delete({ id });
    if (result.affected <= 0) {
      throw new NotFoundException();
    }
  }
}
