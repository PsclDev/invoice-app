import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { Client } from 'modules/client/client.entity';
import { Document, Offer } from 'modules/document/document.entity';
import { Attachment } from 'nodemailer/lib/mailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private mailerService: MailerService) {}

  async send(client: Client, doc: Document, path: string): Promise<boolean> {
    try {
      const filename = path.slice(path.lastIndexOf('/'), 1);
      const attachments: Attachment[] = [
        {
          filename,
          path,
          contentType: 'application/pdf',
        },
      ];

      await this.mailerService.sendMail({
        to: client.email,
        subject: doc.invoiceNr
          ? `Invoice #${doc.invoiceNr}`
          : `Invoice #${(doc as Offer).offerNr}`,
        template: doc.invoiceNr ? 'invoice' : 'offer',
        context: {
          salutation: 'abc',
          name: `${client.firstname} ${client.lastname}`,
        },
        attachments,
      });
      return true;
    } catch (error) {
      this.logger.error(error);
      return false;
    }
  }
}
