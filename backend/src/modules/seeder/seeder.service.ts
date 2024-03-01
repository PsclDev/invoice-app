import { ConfigService } from '@config';
import { faker } from '@faker-js/faker/locale/de';
import {
  ClientService,
  CreateClientDto,
  CreateCompanyClientDto,
  Gender,
} from '@modules/client';
import {
  CreateInvoiceDto,
  CreateOfferDto,
  InvoiceService,
  OfferService,
} from '@modules/document';
import {
  CreateSettingDto,
  FileKey,
  GptKey,
  MailKey,
  PdfKey,
  SettingService,
  SettingType,
} from '@modules/setting';
import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { getConnection } from 'typeorm';

@Injectable()
export class SeederService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly clientService: ClientService,
    private readonly settingService: SettingService,
    private readonly offerService: OfferService,
    private readonly invoiceService: InvoiceService,
  ) {}

  async onApplicationBootstrap() {
    const connection = await getConnection();
    await connection.runMigrations();
    connection.migrations.forEach((migration) => {
      this.logger.log(`Migrated: ${migration.name}`);
    });
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

    const gptModel: CreateSettingDto = {
      type: SettingType.GPT,
      key: GptKey.MODEL,
      title: 'GPT Model',
      value: 'gpt-4',
      inputType: 'text',
    };

    const gptPrePrompt: CreateSettingDto = {
      type: SettingType.GPT,
      key: GptKey.PRE_PROMPT,
      title: 'GPT Pre Prompt',
      value:
        'The context is an invoicing app, the user uses the chat assistant to automatically generate and improve for descriptions of their quotes and invoices. The answer should summarize and better formulate the user input. The format of the response is a list with Maximum 10 entries. Maximum 60 characters per entry. The format of the list should be without numbers, letters or characters but only separated with new lines.',
      inputType: 'textarea',
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
      ...(this.configService.gpt.enabled
        ? [
            { setting: gptModel, deletable: false },
            { setting: gptPrePrompt, deletable: false },
          ]
        : []),
    ]);
  }

  private async devData() {
    const existingClients = await this.clientService.findAll();

    const generateDocumentDescription = () => {
      const description: string[] = [];
      description.push(`Object address: ${faker.location.streetAddress()}`);
      description.push('');
      for (let idx = 0; idx < Math.floor(Math.random() * 6) + 1; idx++) {
        description.push(faker.lorem.sentence({ min: 3, max: 6 }));
      }
      return description;
    };

    if (existingClients.length === 0) {
      const clients: CreateClientDto[] = [];
      for (let idx = 0; idx < 10; idx++) {
        clients.push({
          gender: Gender[faker.person.sexType().toUpperCase()],
          firstname: faker.person.firstName(),
          lastname: faker.person.lastName(),
          email: faker.internet.email(),
          street: faker.location.streetAddress(),
          postalCode: faker.location.zipCode('#####'),
          city: faker.location.city(),
        });
      }

      const companies: CreateCompanyClientDto[] = [];
      for (let idx = 0; idx < 5; idx++) {
        companies.push({
          company: faker.company.name(),
          vat: `DE-${faker.string.numeric(9)}`,
          gender: Gender[faker.person.sexType().toUpperCase()],
          firstname: faker.person.firstName(),
          lastname: faker.person.lastName(),
          email: faker.internet.email(),
          street: faker.location.streetAddress(),
          postalCode: faker.location.zipCode('#####'),
          city: faker.location.city(),
        });
      }

      const privateClients = await this.clientService.bulkInsert(clients);
      const companyClients = await this.clientService.bulkInsertCompanies(
        companies,
      );
      const shuffleClients = [...privateClients, ...companyClients].sort(
        () => Math.random() - 0.5,
      );

      let offerNr = 1,
        invoiceNr = 1;
      const offers: CreateOfferDto[] = [];
      const invoices: CreateInvoiceDto[] = [];
      for (let idx = 0; idx < shuffleClients.length; idx++) {
        for (let i = 0; i < Math.floor(Math.random() * 3) + 1; i++) {
          const isOffer = Math.random() > 0.5;
          const dateOfIssue = new Date();
          const subTotal = Number(faker.finance.amount(100, 5000, 2));

          if (isOffer) {
            offers.push({
              clientId: shuffleClients[idx],
              offerNr,
              dateOfIssue,
              description: generateDocumentDescription(),
              subTotal,
              tax: subTotal * 0.19,
              taxRate: 19,
              total: subTotal * 1.19,
            });
            offerNr++;
          } else {
            const alreadyPaid = Number(faker.finance.amount(0, subTotal, 2));
            invoices.push({
              clientId: shuffleClients[idx],
              invoiceNr,
              dateOfIssue,
              dueDate: new Date(
                dateOfIssue.getTime() + 8 * 24 * 60 * 60 * 1000,
              ),
              description: generateDocumentDescription(),
              subTotal,
              tax: subTotal * 0.19,
              taxRate: 19,
              alreadyPaid,
              total: subTotal * 1.19 - alreadyPaid,
            });
            invoiceNr++;
          }
        }
      }

      for (let idx = 0; idx < offers.length; idx++) {
        await this.offerService.createOffer(offers[idx]);
      }
      for (let idx = 0; idx < invoices.length; idx++) {
        await this.invoiceService.createInvoice(invoices[idx]);
      }
    }
  }
}
