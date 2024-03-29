import { CustomCacheService } from '@modules/common';
import { FileKey, SettingService, SettingType } from '@modules/setting';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { generateId, updateEntity } from '@utils';
import { Repository } from 'typeorm';

import { CreateInvoiceDto, UpdateInvoiceDto } from '../document.dto';
import { Document, Invoice } from '../document.entity';
import { DocumentService } from './document.service';

@Injectable()
export class InvoiceService {
  private readonly logger = new Logger(InvoiceService.name);

  constructor(
    private readonly customCacheService: CustomCacheService<Document>,
    private readonly documentService: DocumentService,
    private readonly settingService: SettingService,
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,
    @InjectRepository(Invoice)
    private invoiceRepository: Repository<Invoice>,
  ) {}

  async getNewInvoiceNr(): Promise<number> {
    const latestNr: number = await this.documentService.getMaxValue<Invoice>(
      this.invoiceRepository,
      'invoiceNr',
    );

    if (latestNr === null) {
      const setting = await this.settingService.findByTypeAndKey(
        SettingType.FILE,
        FileKey.INVOICE_STARTING_NR,
      );

      return Number(setting.value);
    }

    return latestNr + 1;
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

    const invoice = await this.invoiceRepository.save({
      id: generateId<Document>(this.documentRepository),
      ...invoiceDto,
    });

    await this.customCacheService.addNewDataToCache(invoice);

    return invoice;
  }

  async updateInvoice(id: string, invoiceDto: UpdateInvoiceDto) {
    await updateEntity<Invoice>(this.invoiceRepository, id, invoiceDto);

    const invoice = await this.documentService.findById(id);
    await this.customCacheService.updateExistingDataInCache(id, invoice);
  }
}
