import { DocumentInterface } from './document';
import { Gender } from './enums';

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
