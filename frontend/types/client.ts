import { DocumentInterface } from './document';
export enum ClientType {
  PRIVATE = 'private',
  COMPANY = 'company',
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  DIVERS = 'DIVERS',
}

export interface ClientInterface {
  id: string;
  gender: Gender;
  firstname: string;
  lastname: string;
  email: string;
  street: string;
  postalCode: string;
  city: string;
  documents: DocumentInterface[];
  createdAt?: Date;
  updatedAt?: Date;
  company: string;
  vat: string;
}
