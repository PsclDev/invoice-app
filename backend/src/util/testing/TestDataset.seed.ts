import { SettingType, MailKey, PdfKey, FileKey } from '@helper';
import { Client, CompanyClient, Gender } from '@modules/client';
import { Offer, Invoice } from '@modules/document';
import { Setting } from '@modules/setting';
import { EntityManager, getConnection } from 'typeorm';

export const privateClientId = 'azx9d3g4';
export const companyClientId = 'pla5b2i7';
export const offerId = 'inc4sd71';
export const invoiceId = 'dhc3l1k6';
export const deletableSettingId = 'khu5l2k9';
export const nonDeletableSettingId = 'cu28xhg7';

const insertClients = async (entityManager: EntityManager) => {
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

const insertDocuments = async (entityManager: EntityManager) => {
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

export const clientSeed = async () => {
  const connection = await getConnection();
  const entityManager = connection.createEntityManager();

  await insertClients(entityManager);
};

export const documentSeed = async () => {
  const connection = await getConnection();
  const entityManager = connection.createEntityManager();

  await insertClients(entityManager);
  await insertDocuments(entityManager);
};

export const settingSeed = async () => {
  const connection = await getConnection();
  const entityManager = connection.createEntityManager();

  entityManager.insert<Setting>(Setting, {
    id: deletableSettingId,
    type: SettingType.MAIL,
    key: MailKey.INVOICE_SUBJECT,
    title: 'test',
    value: 'value',
    deletable: true,
  });

  entityManager.insert<Setting>(Setting, {
    id: nonDeletableSettingId,
    type: SettingType.PDF,
    key: PdfKey.COMPANY_NAME,
    title: 'test',
    value: 'value',
    deletable: false,
  });

  entityManager.insert<Setting>(Setting, {
    id: nonDeletableSettingId,
    type: SettingType.FILE,
    key: FileKey.INVOICE_PREFIX,
    title: 'test',
    value: 'value',
    deletable: false,
  });
};
