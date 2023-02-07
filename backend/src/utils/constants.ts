import { Client } from '@modules/client/';
import { Document } from '@modules/document';

export type AppTypes = Client | Document;

export enum CacheKeys {
  CLIENT = 'clients',
  DOCUMENT = 'docs',
  STATISTIC = 'stats',
  NONE = 'none',
}
