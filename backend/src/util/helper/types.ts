import { Client } from '@modules/client/';
import { Document } from '@modules/document';

export type AppTypes = Client | Document;
export type SettingKeyType = PdfKey | MailKey | FileKey;
export type SettingInputType = 'string' | 'number';

export enum DocumentType {
  OFFER = 'Offer',
  INVOICE = 'Invoice',
}

export enum CacheKeys {
  CLIENT = 'clients',
  DOCUMENT = 'docs',
  STATISTIC = 'stats',
}

export enum SettingType {
  PDF = 'PDF',
  MAIL = 'MAIL',
  FILE = 'FILE',
}

export enum PdfKey {
  COMPANY_NAME = 'COMPANY_NAME',
  COMPANY_ADRESS = 'COMPANY_ADRESS',
  COMPANY_TAXID = 'COMPANY_TAXID',
  PAYMENT_NAME = 'PAYMENT_NAME',
  PAYMENT_IBAN = 'PAYMENT_IBAN',
}

export enum MailKey {
  INVOICE_SUBJECT = 'INVOICE_SUBJECT',
  INVOICE_TEXT = 'INVOICE_TEXT',
  OFFER_SUBJECT = 'OFFER_SUBJECT',
  OFFER_TEXT = 'OFFER_TEXT',
}

export enum FileKey {
  INVOICE_PREFIX = 'INVOICE_PREFIX',
  OFFER_PREFIX = 'OFFER_PREFIX',
}
