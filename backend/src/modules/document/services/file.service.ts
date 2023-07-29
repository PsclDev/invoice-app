import { ConfigService } from '@config';
import { Client } from '@modules/client';
import { FileKey, SettingService, SettingType } from '@modules/setting';
import { Injectable, Logger } from '@nestjs/common';
import { formatDocumentNumber } from '@utils';
import * as dayjs from 'dayjs';
import { existsSync, writeFileSync } from 'fs';
import { mkdir } from 'fs/promises';
import { join } from 'path';

import { Document, Invoice, Offer } from '../document.entity';
import { DocumentType } from '../document.types';

@Injectable()
export class FileService {
  private readonly logger = new Logger(FileService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly settingsService: SettingService,
  ) {}

  async saveDocument(
    client: Client,
    document: Document,
    pdf: Buffer,
  ): Promise<string> {
    //save to serve
    const filepath = await this.buildFilepath(client, document);
    writeFileSync(filepath, pdf);
    //save to another location like a NAS or something
    writeFileSync(await this.buildFilepath(client, document, true), pdf);

    return filepath;
  }

  async getPathToFile(dateOfIssue: Date, withBase = true): Promise<string> {
    const date = dayjs(dateOfIssue);
    const year = date.year().toString();
    const month = String(date.month() + 1).padStart(2, '0');

    if (withBase) return join('files', year, month);
    return join(year, month);
  }

  async buildFilepath(
    client: Client,
    document: Document,
    exportPath = false,
  ): Promise<string> {
    let filePath = '';
    if (exportPath) {
      filePath = `${this.configService.pdfBackupExport}/`;
      filePath += await this.getPathToFile(document.dateOfIssue, false);
    } else filePath = await this.getPathToFile(document.dateOfIssue);
    await this.checkPathOrCreate(filePath);

    const isInvoice = document.type === DocumentType.INVOICE;
    const filePrefixSetting = await this.settingsService.findByTypeAndKey(
      SettingType.FILE,
      isInvoice ? FileKey.INVOICE_PREFIX : FileKey.OFFER_PREFIX,
    );

    const docNr = isInvoice
      ? (document as Invoice).invoiceNr
      : (document as Offer).offerNr;
    const fileNr = formatDocumentNumber(docNr);
    const fileName = `${client.firstname}_${client.lastname}.pdf`;

    return `${filePath}/${filePrefixSetting.value}${fileNr}_${fileName}`;
  }

  async checkPathOrCreate(path: string) {
    if (!existsSync(path)) await mkdir(path, { recursive: true });
  }
}
