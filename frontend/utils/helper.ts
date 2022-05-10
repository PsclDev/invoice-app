import dayjs from 'dayjs';
import { Client } from '~/models/client';
import { Document } from '~/models/document';
import { ClientType, DocumentType } from '~/types';

export function getDate(date?: Date, withTime: boolean = false): string {
  if (!date) return '';
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
  return { ...client } as Client;
}

export function getDocumentsLength(client: Client): number {
  return client.documents ? client.documents.length : 0;
}

export function getMutableDocument(document: Document): Document {
  return { ...document } as Document;
}
