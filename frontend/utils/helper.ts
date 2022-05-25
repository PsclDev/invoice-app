import dayjs from 'dayjs';
import { Client } from '~/models/client';
import { Document } from '~/models/document';
import { Setting } from '~/models/setting';
import { ClientType, DateTimeFormat, DocumentType } from '~/types';

export function getDate(
  date?: Date | string,
  format: DateTimeFormat = DateTimeFormat.DATE
): string {
  let toFormat = '';
  switch (format) {
    case DateTimeFormat.FULL:
      toFormat = 'DD.MM.YYYY HH:MM:ss';
      break;
    case DateTimeFormat.DATE:
      toFormat = 'DD.MM.YYYY';
      break;
    case DateTimeFormat.TIME:
      toFormat = 'HH:mm:ss';
      break;
  }

  if (!date) return dayjs().format(toFormat);
  return dayjs(date).format(toFormat);
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
