import { Document } from './document';
import { ClientInterface } from '~/types/client';
import { Gender } from '~/types';

export class Client implements ClientInterface {
  id!: string;
  gender!: Gender;
  firstname!: string;
  lastname!: string;
  email!: string;
  street!: string;
  postalCode!: string;
  city!: string;
  documents!: Document[];
  createdAt?: Date | undefined;
  updatedAt?: Date | undefined;
  company!: string;
  vat!: string;
}
