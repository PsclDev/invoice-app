import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from '../document.entity';
import { ClientService } from 'client/client.service';
import { MailService } from 'mail/mail.service';
import * as puppeteer from 'puppeteer';
import configuration from 'config/configuration';
import { Client } from 'client/client.entity';
import { FileService } from './file.service';
@Injectable()
export class DocumentService {
  private readonly logger = new Logger(DocumentService.name);

  constructor(
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

  async generate(id: string): Promise<void> {
    const infos = await this.getDocumentWithClient(id);
    if (!infos) throw new NotFoundException();

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

    const { client, doc } = infos;
    this.fileService.saveDocument(client, doc, pdfFile);
  }

  async print(id: string): Promise<string> {
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
