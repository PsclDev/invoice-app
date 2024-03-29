import { Document, ReducedDocument } from './document';

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  DIVERS = 'DIVERS',
}

export interface Client {
  id: string;
  company: string;
  vat: string;
  gender: Gender;
  firstname: string;
  lastname: string;
  email: string;
  street: string;
  postalCode: string;
  city: string;
  documents: ReducedDocument[];
  createdAt?: string;
  updatedAt?: string;
}

export type ClientDto = Omit<Client, 'documents'> & { documents: Document[] };

export type ClientForm = Omit<
  Client,
  'id' | 'documents' | 'createdAt' | 'updatedAt'
>;
