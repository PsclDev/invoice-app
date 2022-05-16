import { Injectable, Logger } from '@nestjs/common';
import { Client } from 'client/client.entity';
import { ConfigService } from 'config/config.service';
import * as dayjs from 'dayjs';
import { existsSync, writeFileSync } from 'fs';
import { mkdir } from 'fs/promises';
import { join } from 'path';
import { Document, Offer } from '../document.entity';

@Injectable()
export class FileService {
  private readonly logger = new Logger(FileService.name);

  constructor(private readonly configService: ConfigService) {}

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

    const isInvoice = !!document.invoiceNr;
    const filePrefix = isInvoice ? 'I' : 'O';
    const fileNr = String(
      isInvoice ? document.invoiceNr : (document as Offer).offerNr,
    ).padStart(4, '0');
    const fileName = `${client.firstname}_${client.lastname}.pdf`;

    return `${filePath}/${filePrefix}${fileNr}_${fileName}`;
  }

  async checkPathOrCreate(path: string) {
    if (!existsSync(path)) await mkdir(path, { recursive: true });
  }
}
