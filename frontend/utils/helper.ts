import dayjs from 'dayjs';
import { Client } from '~/models/client';
import { Document } from '~/models/document';
import { Setting } from '~/models/setting';
import { ClientType, DocumentType } from '~/types';

export function getDate(
  date?: Date | string,
  withTime: boolean = false
): string {
  const format = withTime ? 'DD.MM.YYYY HH:MM:ss' : 'DD.MM.YYYY';
  if (!date) return dayjs().format(format);
  return dayjs(date).format(format);
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

export function getMutableSetting(setting: Setting): Setting {
  return { ...setting } as Setting;
}
