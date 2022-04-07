import { Gender } from '../../client/client.dto';
import { Client, CompanyClient } from '../../client/client.entity';
import { EntityManager, getConnection } from 'typeorm';
import { Invoice, Offer } from '../../document/document.entity';

export const privateClientId = 'azx9d3g4';
export const companyClientId = 'pla5b2i7';
export const offerId = 'inc4sd71';
export const invoiceId = 'dhc3l1k6';

const insertClients = async (entityManager: EntityManager) => {
  entityManager.insert<Client>(Client, {
    id: privateClientId,
    firstname: 'Erika',
    lastname: 'Musermann',
    gender: Gender.FEMALE,
    email: 'erika@mustermann.de',
    street: 'Musterweg 2',
    postalCode: '98765',
    city: 'Musterhausen',
  });

  entityManager.insert<CompanyClient>(CompanyClient, {
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
  entityManager.insert<Offer>(Offer, {
    id: offerId,
    dateOfIssue: new Date('20211-01-01'),
    clientId: 'azx9d3g4',
    description: ['a', 'b', 'c'],
    subTotal: 100,
    tax: 19,
    total: 119,
  });

  entityManager.insert<Invoice>(Invoice, {
    id: invoiceId,
    invoiceNr: 1,
    dateOfIssue: new Date('20211-01-01'),
    dueDate: new Date('20211-01-01'),
    clientId: 'azx9d3g4',
    description: ['a', 'b', 'c'],
    subTotal: 1000,
    tax: 190,
    alreadyPaid: 400,
    total: 790,
  });
};

export const clientSeed = async () => {
  const connection = await getConnection();
  const entityManager = connection.createEntityManager();

  insertClients(entityManager);
};

export const documentSeed = async () => {
  const connection = await getConnection();
  const entityManager = connection.createEntityManager();

  insertClients(entityManager);
  insertDocuments(entityManager);
};
