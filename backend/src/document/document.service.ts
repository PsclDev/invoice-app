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
import { customAlphabet } from 'nanoid';

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
      id: this.generateId(),
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
    const result = await this.invoiceRepository.update({ id }, invoiceDto);

    if (result.affected <= 0) {
      throw new NotFoundException();
    }
  }

  async createOffer(offerDto: CreateOfferDto): Promise<Document> {
    const total = Number(offerDto.subTotal + offerDto.tax);
    const offer: Offer = {
      id: this.generateId(),
      subTotal: offerDto.subTotal,
      tax: offerDto.tax,
      total: total,
      client: offerDto.client,
      dateOfIssue: offerDto.dateOfIssue,
      description: offerDto.description,
    };

    return await this.offerRepository.save(offer);
  }

  async updateOffer(id: string, offerDto: UpdateOfferDto) {
    const result = await this.offerRepository.update({ id }, offerDto);

    if (result.affected <= 0) {
      throw new NotFoundException();
    }
  }

  async delete(id: string) {
    const result = await this.documentRepository.delete({ id });
    if (result.affected <= 0) {
      throw new NotFoundException();
    }
  }

  private generateId(): string {
    const alphabet = '0123456789abcdefghijklmnopqrstuvwxyz';
    let id = '';
    let exists = false;
    do {
      id = customAlphabet(alphabet, 8)();
      const doc = this.documentRepository.find({ id });
      doc ? (exists = true) : (exists = false);
    } while (!exists);

    return id;
  }
}
