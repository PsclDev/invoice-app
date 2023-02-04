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
      inputType: 'text',
    };

    const invoiceText: CreateSettingDto = {
      type: SettingType.MAIL,
      key: MailKey.INVOICE_TEXT,
      title: 'Invoice Text',
      value: '',
      inputType: 'textarea',
    };

    const offerSubject: CreateSettingDto = {
      type: SettingType.MAIL,
      key: MailKey.OFFER_SUBJECT,
      title: 'Offer Subject',
      value: '',
      inputType: 'text',
    };

    const offerText: CreateSettingDto = {
      type: SettingType.MAIL,
      key: MailKey.OFFER_TEXT,
      title: 'Offer Text',
      value: '',
      inputType: 'textarea',
    };

    const companyName: CreateSettingDto = {
      type: SettingType.PDF,
      key: PdfKey.COMPANY_NAME,
      title: 'Company Name',
      value: 'Muster GmbH',
      inputType: 'text',
    };

    const companyAddress: CreateSettingDto = {
      type: SettingType.PDF,
      key: PdfKey.COMPANY_ADRESS,
      title: 'Company Address',
      value: 'Musterweg 2, 12345 Musterstadt',
      inputType: 'text',
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
      inputType: 'text',
    };

    const paymentIban: CreateSettingDto = {
      type: SettingType.PDF,
      key: PdfKey.PAYMENT_IBAN,
      title: 'Payment Iban',
      value: 'DE89 3704 0044 0532 0130 00',
      inputType: 'text',
      inputMask: '#### #### #### #### #### ##',
    };

    const invoiceDocumentPrefix: CreateSettingDto = {
      type: SettingType.FILE,
      key: FileKey.INVOICE_PREFIX,
      title: 'Invoice Document Prefix',
      value: 'I_',
      inputType: 'text',
    };

    const offerDocumentPrefix: CreateSettingDto = {
      type: SettingType.FILE,
      key: FileKey.OFFER_PREFIX,
      title: 'Offer Document Prefix',
      value: 'O_',
      inputType: 'text',
    };

    const invoiceStartingNumber: CreateSettingDto = {
      type: SettingType.FILE,
      key: FileKey.INVOICE_STARTING_NR,
      title: 'Invoice starting number',
      value: '0',
      inputType: 'number',
    };

    const offerStartingNumber: CreateSettingDto = {
      type: SettingType.FILE,
      key: FileKey.OFFER_STARTING_NR,
      title: 'Offer starting number',
      value: '0',
      inputType: 'number',
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
      { setting: invoiceStartingNumber, deletable: false },
      { setting: offerStartingNumber, deletable: false },
    ]);
  }

  private async devData() {
    //
  }
}
