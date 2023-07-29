import { ConfigService } from '@config';
import { Client, ClientService } from '@modules/client';
import { CustomCacheService } from '@modules/common';
import { MailService } from '@modules/mail';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { updateEntity } from '@utils';
import * as puppeteer from 'puppeteer';
import { Repository } from 'typeorm';

import { DocumentMailOptionsDto } from '../document.dto';
import { Document } from '../document.entity';
import { FileService } from './file.service';

@Injectable()
export class DocumentService {
  private readonly logger = new Logger(DocumentService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly customCacheService: CustomCacheService<Document>,
    private readonly fileService: FileService,
    private readonly clientService: ClientService,
    private readonly mailService: MailService,
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,
  ) {}

  async findAll(): Promise<Document[]> {
    const expectedItems = await this.documentRepository.count();
    const cachedDocuments = await this.customCacheService.getCachedData();
    if (cachedDocuments && cachedDocuments.length === expectedItems) {
      this.logger.log('Getting documents from cache');
      return cachedDocuments;
    }

    const documents = await this.documentRepository.find({
      order: {
        dateOfIssue: 'DESC',
        createdAt: 'DESC',
      },
    });
    await this.customCacheService.setDataToCache(documents);

    return documents;
  }

  async findById(id: string): Promise<Document> {
    const cachedDocuments = await this.customCacheService.getCachedData();
    if (cachedDocuments) {
      const document = cachedDocuments.find((c) => c.id === id);

      if (document) {
        this.logger.log(`Getting document '${id}' from cache`);
        return document;
      }
    }

    const document = await this.documentRepository.findOne({ id });

    if (!document) throw new NotFoundException();

    return document;
  }

  async getMaxValue<T>(repo: Repository<T>, field: string) {
    const query = repo.createQueryBuilder('documentation');
    query.select(`MAX("${field}")`, 'max');
    return (await query.getRawOne()).max;
  }

  async delete(id: string): Promise<string> {
    const result = await this.documentRepository.delete({ id });

    if (result.affected <= 0) {
      throw new NotFoundException();
    }

    await this.customCacheService.deleteDataFromCache(id);

    return id;
  }

  async generate(id: string): Promise<string> {
    const infos = await this.getDocument(id, true);
    const executablePath = this.configService.chromiumPath || null;
    this.logger.debug(`Chromium path: ${executablePath}`);

    const ignoreHTTPSErrors = this.configService.ignoreHTTPSErrors;
    this.logger.debug(`Chromium ignore HTTPS errors: ${ignoreHTTPSErrors}`);

    const args = this.configService.chromiumNoSandboxMode
      ? ['--no-sandbox']
      : [];
    this.logger.debug(`Chromium args: ${executablePath}`);

    const browser = await puppeteer.launch({
      executablePath,
      headless: true,
      ignoreHTTPSErrors,
      args,
    });

    const page = await browser.newPage();
    page.setViewport({ width: 1920, height: 1080 });
    await page.goto(`${this.configService.frontendUrl}/pdf/${id}`, {
      waitUntil: 'networkidle2',
    });

    const pdfFile = await page.pdf({
      format: 'A4',
      printBackground: true,
    });
    await browser.close();

    const { client, doc } = infos;
    const filepath = await this.fileService.saveDocument(client, doc, pdfFile);
    await updateEntity<Document>(this.documentRepository, doc.id, {
      filepath,
    });
    return filepath;
  }

  async print(id: string): Promise<string> {
    const path = await this.generate(id);
    return '/' + path;
  }

  async mail(
    id: string,
    options: DocumentMailOptionsDto | undefined,
  ): Promise<boolean> {
    if (options.delayDelivery) {
      return this.mailService.addToQueue(id);
    }

    const infos = await this.getDocument(id, true);
    const { client, doc } = infos;
    const filepath = await this.generate(id);

    return await this.mailService.send(client, doc, filepath);
  }

  async getDocument(
    id: string,
    withClient = false,
  ): Promise<{ doc: Document; client?: Client }> {
    const doc = await this.findById(id);
    if (!doc) throw new NotFoundException('Document not found');

    if (withClient) {
      const client = await this.clientService.findById(doc.clientId);
      if (!client) throw new NotFoundException('Client not found');
      return { doc, client };
    }

    return { doc };
  }
}
