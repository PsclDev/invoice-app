import { Client } from '../../modules/client/client.entity';
import { Document } from '../../modules/document/document.entity';

export type AppTypes = Client | Document;

export enum DocumentType {
  OFFER = 'Offer',
  INVOICE = 'Invoice',
}

export enum CacheKeys {
  CLIENT = 'clients',
  DOCUMENT = 'docs',
  STATISTIC = 'stats',
}
