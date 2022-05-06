import dayjs from 'dayjs';
import { Client } from '~/models/client';
import { Document } from '~/models/document';
import { ClientType, DocumentType } from '~/types';

export function getDate(date: Date, withTime: boolean = false): string {
  return dayjs(date).format(withTime ? 'DD.MM.YYYY HH:MM:ss' : 'DD.MM.YYYY');
}

export function getClientType(client: Client): ClientType {
  if (client.company) return ClientType.COMPANY;
  return ClientType.PRIVATE;
}

export function getDocumentType(document: Document): DocumentType {
  if (document.invoiceNr) return DocumentType.INVOICE;
  return DocumentType.OFFER;
}

export function getMutableClient(client: Client): Client {
  return {
    id: client.id,
    company: client.company,
    vat: client.vat,
    gender: client.gender,
    firstname: client.firstname,
    lastname: client.lastname,
    email: client.email,
    street: client.street,
    postalCode: client.postalCode,
    city: client.city,
  } as Client;
}

export function getMutableDocument(document: Document): Document {
  return {
    id: document.id,
    clientId: document.clientId,
    dateOfIssue: document.dateOfIssue,
    description: document.description,
    createdAt: document.createdAt,
    updatedAt: document.updatedAt,
    invoiceNr: document.invoiceNr,
    subTotal: document.subTotal,
    tax: document.tax,
    taxRate: document.taxRate,
    total: document.total,
    alreadyPaid: document.alreadyPaid,
    dueDate: document.dueDate,
  };
}
