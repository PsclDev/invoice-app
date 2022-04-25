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
import * as dayjs from 'dayjs';
import { ClientService } from 'client/client.service';
import { MailService } from 'mail/mail.service';
import * as puppeteer from 'puppeteer';
import { writeFileSync } from 'fs';
import configuration from 'config/configuration';
import { Client } from 'client/client.entity';
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
    private readonly clientService: ClientService,
    private readonly mailService: MailService,
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

  async getNewOfferNr(): Promise<number> {
    const latestNr: number = await this.getMaxValue<Offer>(
      this.offerRepository,
      'offerNr',
    );

    return latestNr + 1;
  }

  async getNewInvoiceNr(): Promise<number> {
    const latestNr: number = await this.getMaxValue<Invoice>(
      this.invoiceRepository,
      'invoiceNr',
    );

    return latestNr + 1;
  }

  async getMaxValue<T>(repo: Repository<T>, field: string) {
    const query = repo.createQueryBuilder('documentation');
    query.select(`MAX("${field}")`, 'max');
    return (await query.getRawOne()).max;
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

  async convertOffer(id: string): Promise<Invoice> {
    const offer = await this.offerRepository.findOne({ id });
    const createInvoice: CreateInvoiceDto = {
      invoiceNr: await this.getNewInvoiceNr(),
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

    offer.invoiceId = invoice.id;
    this.offerRepository.save(offer);
    return invoice;
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

  async print(id: string): Promise<string> {
    const infos = await this.getDocumentWithClient(id);
    if (!infos) throw new NotFoundException();
    const { doc, client } = infos;

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    page.setViewport({ width: 1920, height: 1080 });

    await page.goto(`${configuration().frontendUrl}/pdf/${id}`, {
      waitUntil: 'networkidle2',
    });

    const pdfFile = await page.pdf({
      format: 'A4',
      printBackground: true,
    });

    await browser.close();

    const isInvoice = !!doc.invoiceNr;
    const filePrefix = isInvoice ? 'I' : 'O';
    const fileNr = String(
      isInvoice ? doc.invoiceNr : (doc as Offer).offerNr,
    ).padStart(4, '0');
    const fileName = `${client.firstname}_${client.lastname}`;

    writeFileSync(
      `${configuration().pdfExport}/${filePrefix}_${fileNr}_${fileName}.pdf`,
      pdfFile,
    );
    return `TODO: print document with id ${id}`;
  }

  async send(id: string) {
    const infos = await this.getDocumentWithClient(id);
    await this.mailService.sendTest(infos.client, infos.doc);
  }

  async getDocumentWithClient(
    id: string,
  ): Promise<{ doc: Document; client: Client }> {
    const doc = await this.documentRepository.findOne({ id });
    const client = await this.clientService.findById(doc.clientId);
    return { doc, client };
  }
}
