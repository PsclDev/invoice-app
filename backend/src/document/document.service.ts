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
    return await this.documentRepository.find({
      order: {
        dateOfIssue: 'DESC',
      },
    });
  }

  async findById(id: string): Promise<Document> {
    const document = await this.documentRepository.findOne({ id });

    if (!document) throw new NotFoundException();

    return document;
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

    return await this.invoiceRepository.save({
      id: generateId<Document>(this.documentRepository),
      ...invoiceDto,
    });
  }

  async updateInvoice(id: string, invoiceDto: UpdateInvoiceDto) {
    await updateEntity<Invoice>(this.invoiceRepository, id, invoiceDto);
  }

  async createOffer(offerDto: CreateOfferDto): Promise<Document> {
    return await this.offerRepository.save({
      id: generateId<Document>(this.documentRepository),
      ...offerDto,
    });
  }

  async updateOffer(id: string, offerDto: UpdateOfferDto) {
    await updateEntity<Offer>(this.offerRepository, id, offerDto);
  }

  async delete(id: string): Promise<string> {
    const result = await this.documentRepository.delete({ id });
    if (result.affected <= 0) {
      throw new NotFoundException();
    }
    return id;
  }

  async generate(id: string): Promise<string> {
    return `TODO: generate document with id ${id}`;
  }
}
