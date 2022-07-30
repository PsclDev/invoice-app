import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { Client } from '@modules/client/client.entity';
import { Document } from '@modules/document/document.entity';
import * as Mustache from 'mustache';
import { SettingService } from '@modules/setting/setting.service';
import { SettingType } from '@modules/setting/setting.dto';
import { Setting } from '@modules/setting/setting.entity';

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
        subject: await this.getContent('Subject', client, doc),
        html: await this.getContent('Text', client, doc),
        attachments,
      });
      return true;
    } catch (error) {
      this.logger.error(error);
      return false;
    }
  }

  async getContent(
    key: string,
    client: Client,
    doc: Document,
  ): Promise<string> {
    const value = await this.getKey(`${doc.type} ${key}`);
    return this.convertTemplates(value, client, doc);
  }

  async getKey(key: string): Promise<string> {
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
        return this.invoiceNr.toString().padStart(4, '0');
      },
      formattedOfferNr: function () {
        return this.offerNr.toString().padStart(4, '0');
      },
    });
  }
}
