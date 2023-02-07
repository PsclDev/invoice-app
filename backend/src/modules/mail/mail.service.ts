import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { Client } from '@modules/client';
import { Document } from '@modules/document';
import { DocumentType } from '@modules/document/document.types';
import * as Mustache from 'mustache';
import {
  Setting,
  SettingService,
  MailKey,
  SettingKeyType,
  SettingType,
} from '@modules/setting';
import { formatDocumentNumber } from '@utils';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private settings: Setting[];

  constructor(
    private readonly mailerService: MailerService,
    private readonly settingsService: SettingService,
  ) {}

  async send(client: Client, doc: Document, path: string): Promise<boolean> {
    this.settings = await (
      await this.settingsService.findAll()
    ).filter((s) => s.type === SettingType.MAIL);

    try {
      const filename = path.slice(path.lastIndexOf('/'), 1);
      const attachments: any[] = [
        {
          filename,
          path,
          contentType: 'application/pdf',
        },
      ];

      await this.mailerService.sendMail({
        to: client.email,
        subject: await this.getSubject(client, doc),
        html: await this.getBody(client, doc),
        attachments,
      });
      return true;
    } catch (error) {
      this.logger.error(error);
      return false;
    }
  }

  async getSubject(client: Client, doc: Document) {
    let value = '';
    if (doc.type === DocumentType.INVOICE) {
      value = await this.getKey(MailKey.INVOICE_SUBJECT);
    } else {
      value = await this.getKey(MailKey.OFFER_SUBJECT);
    }

    return this.convertTemplates(value, client, doc);
  }

  async getBody(client: Client, doc: Document) {
    let value = '';
    if (doc.type === DocumentType.INVOICE) {
      value = await this.getKey(MailKey.INVOICE_TEXT);
    } else {
      value = await this.getKey(MailKey.OFFER_TEXT);
    }

    return this.convertTemplates(value, client, doc);
  }

  async getKey(key: SettingKeyType): Promise<string> {
    const setting = await this.settingsService.findByTypeAndKey(
      SettingType.MAIL,
      key,
    );
    return setting.value;
  }

  async convertTemplates(
    content: string,
    client: Client,
    doc: Document,
  ): Promise<string> {
    return await Mustache.render(content, {
      ...client,
      ...doc,
      ...this.settings,
      fullname: function () {
        return `${this.firstname} ${this.lastname}`;
      },
      formattedInvoiceNr: function () {
        return formatDocumentNumber(this.invoiceNr);
      },
      formattedOfferNr: function () {
        return formatDocumentNumber(this.offerNr);
      },
    });
  }
}
