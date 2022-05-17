import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from '../document.entity';
import * as puppeteer from 'puppeteer';
import { FileService } from './file.service';
import { updateEntity } from '@helper/updateEntity';
import { ConfigService } from 'config/config.service';
import { Client } from 'modules/client/client.entity';
import { ClientService } from 'modules/client/client.service';
import { MailService } from 'modules/mail/mail.service';
@Injectable()
export class DocumentService {
  private readonly logger = new Logger(DocumentService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly fileService: FileService,
    private readonly clientService: ClientService,
    private readonly mailService: MailService,
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,
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
    return id;
  }

  async generate(id: string): Promise<string> {
    const infos = await this.getDocument(id, true);

    const browser = await puppeteer.launch({ headless: true });
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
    return path.replace('files', '');
  }

  async mail(id: string): Promise<boolean> {
    const infos = await this.getDocument(id, true);
    const { client, doc } = infos;
    const filepath = await this.generate(id);

    return await this.mailService.send(client, doc, filepath);
  }

  async getDocument(
    id: string,
    withClient = false,
  ): Promise<{ doc: Document; client?: Client }> {
    const doc = await this.documentRepository.findOne({ id });
    if (!doc) throw new NotFoundException('Document not found');

    if (withClient) {
      const client = await this.clientService.findById(doc.clientId);
      if (!client) throw new NotFoundException('Client not found');
      return { doc, client };
    }

    return { doc };
  }
}
