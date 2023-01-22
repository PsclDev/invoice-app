import { ConfigService } from '@config';
import { SettingType, MailKey, PdfKey, FileKey } from '@helper';
import { CreateSettingDto, SettingService } from '@modules/setting';
import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';

@Injectable()
export class SeederService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly settingService: SettingService,
  ) {}

  async onApplicationBootstrap() {
    await this.baseData();

    if (this.configService.devMode && !this.configService.disableSeeding)
      await this.devData();
    else this.logger.log('Disbaled development seeding');
  }

  private async baseData() {
    this.logger.log('Seeding Basedata to the database');
    await this.settingData();
  }

  private async settingData() {
    const invoiceSubject: CreateSettingDto = {
      type: SettingType.MAIL,
      key: MailKey.INVOICE_SUBJECT,
      title: 'Invoice Subject',
      value: '',
      inputType: 'string',
    };

    const invoiceText: CreateSettingDto = {
      type: SettingType.MAIL,
      key: MailKey.INVOICE_TEXT,
      title: 'Invoice Text',
      value: '',
      inputType: 'string',
    };

    const offerSubject: CreateSettingDto = {
      type: SettingType.MAIL,
      key: MailKey.OFFER_SUBJECT,
      title: 'Offer Subject',
      value: '',
      inputType: 'string',
    };

    const offerText: CreateSettingDto = {
      type: SettingType.MAIL,
      key: MailKey.OFFER_TEXT,
      title: 'Offer Text',
      value: '',
      inputType: 'string',
    };

    const companyName: CreateSettingDto = {
      type: SettingType.PDF,
      key: PdfKey.COMPANY_NAME,
      title: 'Company Name',
      value: 'Muster GmbH',
      inputType: 'string',
    };

    const companyAddress: CreateSettingDto = {
      type: SettingType.PDF,
      key: PdfKey.COMPANY_ADRESS,
      title: 'Company Address',
      value: 'Musterweg 2, 12345 Musterstadt',
      inputType: 'string',
    };

    const companyTaxId: CreateSettingDto = {
      type: SettingType.PDF,
      key: PdfKey.COMPANY_TAXID,
      title: 'Company Tax Id',
      value: '987654321',
      inputType: 'number',
      inputMask: '### #### ##',
    };

    const paymentName: CreateSettingDto = {
      type: SettingType.PDF,
      key: PdfKey.PAYMENT_NAME,
      title: 'Payment Name',
      value: 'Hans Muster',
      inputType: 'string',
    };

    const paymentIban: CreateSettingDto = {
      type: SettingType.PDF,
      key: PdfKey.PAYMENT_IBAN,
      title: 'Payment Iban',
      value: 'DE89 3704 0044 0532 0130 00',
      inputType: 'string',
      inputMask: '#### #### #### #### #### ##',
    };

    const invoiceDocumentPrefix: CreateSettingDto = {
      type: SettingType.PDF,
      key: FileKey.INVOICE_PREFIX,
      title: 'Invoice Document Prefix',
      value: 'I_',
      inputType: 'string',
    };

    const offerDocumentPrefix: CreateSettingDto = {
      type: SettingType.PDF,
      key: FileKey.OFFER_PREFIX,
      title: 'Offer Document Prefix',
      value: 'O_',
      inputType: 'string',
    };

    await this.settingService.bulkInsert([
      { setting: invoiceSubject, deletable: false },
      { setting: invoiceText, deletable: false },
      { setting: offerSubject, deletable: false },
      { setting: offerText, deletable: false },
      { setting: companyName, deletable: false },
      { setting: companyAddress, deletable: false },
      { setting: companyTaxId, deletable: false },
      { setting: paymentName, deletable: false },
      { setting: paymentIban, deletable: false },
      { setting: invoiceDocumentPrefix, deletable: false },
      { setting: offerDocumentPrefix, deletable: false },
    ]);
  }

  private async devData() {
    //
  }
}
