import { ClientService } from '@modules/client';
import {
  DocumentService,
  InvoiceService,
  OfferService,
} from '@modules/document';
import { Injectable, Logger } from '@nestjs/common';
import { exampleDataSet } from './testing.seeder';

@Injectable()
export class TestingService {
  private readonly logger = new Logger(TestingService.name);
  private exampleData;

  constructor(
    private readonly clientService: ClientService,
    private readonly documentService: DocumentService,
    private readonly offerService: OfferService,
    private readonly invoiceService: InvoiceService,
  ) {
    this.exampleData = exampleDataSet();
  }

  async generateOfferPdfExample(): Promise<string> {
    this.logger.log('generateOfferPdfExample');
    const client = await this.clientService.createClient(
      this.exampleData.client,
    );

    this.exampleData.offer.client = client;
    const offer = await this.offerService.createOffer(this.exampleData.offer);

    const link = await this.documentService.print(offer.id);
    await this.documentService.delete(offer.id);
    await this.clientService.delete(client.id);

    return link;
  }

  async generateInvoicePdfExample(): Promise<string> {
    this.logger.log('generateInvoicePdfExample');
    const client = await this.clientService.createClient(
      this.exampleData.client,
    );

    this.exampleData.invoice.client = client;
    const invoice = await this.invoiceService.createInvoice(
      this.exampleData.invoice,
    );

    const link = await this.documentService.print(invoice.id);
    await this.documentService.delete(invoice.id);
    await this.clientService.delete(client.id);

    return link;
  }

  async offerMailTest(email: string): Promise<string> {
    this.logger.log('offerMailTest');
    this.exampleData.client.email = email;
    const client = await this.clientService.createClient(
      this.exampleData.client,
    );

    this.exampleData.offer.client = client;
    const offer = await this.offerService.createOffer(this.exampleData.offer);

    await this.documentService.mail(offer.id, { delayDelivery: false });
    await this.documentService.delete(offer.id);
    await this.clientService.delete(client.id);

    return `Mail was sent to '${email}'`;
  }

  async invoiceMailTest(email: string): Promise<string> {
    this.logger.log('invoiceMailTest');
    this.exampleData.client.email = email;
    const client = await this.clientService.createClient(
      this.exampleData.client,
    );

    this.exampleData.invoice.client = client;
    const invoice = await this.invoiceService.createInvoice(
      this.exampleData.invoice,
    );

    await this.documentService.mail(invoice.id, { delayDelivery: false });
    await this.documentService.delete(invoice.id);
    await this.clientService.delete(client.id);

    return `Mail was sent to '${email}'`;
  }
}
