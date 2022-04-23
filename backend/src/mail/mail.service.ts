import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { Client } from 'client/client.entity';
import { Document, Offer } from 'document/document.entity';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendTest(client: Client, doc: Document) {
    await this.mailerService.sendMail({
      to: client.email,
      subject: doc.invoiceNr
        ? `Invoice #${doc.invoiceNr}`
        : `Invoice #${(doc as Offer).offerNr}`,
      template: doc.invoiceNr ? 'invoice' : 'offer',
      context: {
        name: `${client.firstname} ${client.lastname}`,
      },
    });
  }
}
