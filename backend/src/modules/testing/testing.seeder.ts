import { Client, CompanyClient, Gender } from '@modules/client';
import { DocumentType, Invoice, Offer } from '@modules/document';
import {
  FileKey,
  MailKey,
  PdfKey,
  Setting,
  SettingType,
} from '@modules/setting';
import { EntityManager, getConnection } from 'typeorm';

export const initSeeder = async () => {
  const connection = await getConnection();
  await connection.dropDatabase();
  await connection.runMigrations();
  entityManager = await connection.createEntityManager();
};

let entityManager: EntityManager;
export const privateClientId = 'azx9d3g4';
export const companyClientId = 'pla5b2i7';
export const offerId = 'inc4sd71';
export const invoiceId = 'dhc3l1k6';
export const deletableSettingId = 'khu5l2k9';
export const deletableSettingIdTwo = 'koa491s7';
export const nonDeletableSettingId = 'cu28xhg7';

export const clientSeed = async () => {
  await entityManager.insert<Client>(Client, {
    id: privateClientId,
    firstname: 'Erika',
    lastname: 'Musermann',
    gender: Gender.FEMALE,
    email: 'erika@mustermann.de',
    street: 'Musterweg 2',
    postalCode: '98765',
    city: 'Musterhausen',
  });

  await entityManager.insert<CompanyClient>(CompanyClient, {
    id: companyClientId,
    company: 'Muster GmbH',
    vat: 'DE999999999',
    firstname: 'Max',
    lastname: 'Musermann',
    gender: Gender.MALE,
    email: 'max@mustermann.de',
    street: 'Musterweg 9',
    postalCode: '98765',
    city: 'Musterhausen',
  });
};

export const documentSeed = async () => {
  await entityManager.insert<Offer>(Offer, {
    id: offerId,
    offerNr: 1,
    dateOfIssue: new Date('20211-01-01'),
    clientId: 'azx9d3g4',
    description: ['a', 'b', 'c'],
    subTotal: 100,
    tax: 19,
    taxRate: 19,
    total: 119,
  });

  await entityManager.insert<Invoice>(Invoice, {
    id: invoiceId,
    invoiceNr: 1,
    dateOfIssue: new Date('20211-01-01'),
    dueDate: new Date('20211-01-01'),
    clientId: 'azx9d3g4',
    description: ['a', 'b', 'c'],
    subTotal: 1000,
    tax: 190,
    taxRate: 19,
    alreadyPaid: 400,
    total: 790,
  });
};

export const settingSeed = async () => {
  entityManager.insert<Setting>(Setting, {
    id: deletableSettingIdTwo,
    type: SettingType.PDF,
    key: PdfKey.COMPANY_NAME,
    title: 'company name',
    value: 'value',
    inputType: 'text',
    deletable: false,
  });

  entityManager.insert<Setting>(Setting, {
    id: deletableSettingId,
    type: SettingType.PDF,
    key: PdfKey.COMPANY_ADRESS,
    title: 'company adress',
    value: 'value',
    inputType: 'text',
    deletable: true,
  });

  entityManager.insert<Setting>(Setting, {
    id: nonDeletableSettingId,
    type: SettingType.FILE,
    key: FileKey.INVOICE_PREFIX,
    title: 'invoice prefix',
    value: 'value',
    inputType: 'text',
    deletable: false,
  });
};

export const mailSeed = async () => {
  entityManager.insert<Setting>(Setting, {
    id: 'khu3l5k8',
    type: SettingType.MAIL,
    key: MailKey.INVOICE_SUBJECT,
    title: 'invoice subject',
    value: 'Your Invoice (I#{{formattedInvoiceNr}})',
    inputType: 'text',
    deletable: true,
  });

  entityManager.insert<Setting>(Setting, {
    id: 'khu2l6k9',
    type: SettingType.MAIL,
    key: MailKey.INVOICE_TEXT,
    title: 'invoice text',
    value:
      'Hello {{fullname}}, your Invoice I#{{formattedInvoiceNr}} was created at {{issueDate}} and is due at {{dateOfDue}}',
    inputType: 'text',
    deletable: false,
  });

  entityManager.insert<Setting>(Setting, {
    id: 'khu1l7k0',
    type: SettingType.MAIL,
    key: MailKey.OFFER_SUBJECT,
    title: 'offer subject',
    value: 'Your Offer (O#{{formattedOfferNr}})',
    inputType: 'text',
    deletable: true,
  });

  entityManager.insert<Setting>(Setting, {
    id: 'khu2l4k1',
    type: SettingType.MAIL,
    key: MailKey.OFFER_TEXT,
    title: 'offer text',
    value:
      'Hello {{fullname}}, your Offer O#{{formattedOfferNr}} was created at {{issueDate}}',
    inputType: 'text',
    deletable: false,
  });
};

export const exampleDataSet = () => {
  const client = {
    id: 'client1',
    gender: Gender.MALE,
    firstname: 'John Max',
    lastname: 'Doe Example',
    email: 'email@mail.de',
    street: 'Example Street 1',
    postalCode: '12345',
    city: 'Example City',
  };

  const invoice = {
    client,
    id: 'invoice1',
    offerId: null,
    invoiceNr: 9876,
    type: DocumentType.INVOICE,
    subTotal: 1000,
    tax: 190,
    taxRate: 19,
    alreadyPaid: 100,
    total: 1090,
    clientId: 'client1',
    dateOfIssue: new Date(),
    dueDate: new Date(Date.now() + 12096e5),
    description: [
      'This is a description',
      'This is a description',
      'This is a description',
    ],
    filepath: '',
  };

  const offer = {
    client,
    id: 'offer1',
    invoice: null,
    invoiceId: null,
    offerNr: 1234,
    type: DocumentType.OFFER,
    subTotal: 1000,
    tax: 190,
    taxRate: 19,
    total: 1190,
    clientId: 'client1',
    dateOfIssue: new Date(),
    description: [
      'This is a description',
      'This is a description',
      'This is a description',
    ],
    filepath: '',
  };

  return { client, invoice, offer };
};
