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
  postalCode: number;
  city: string;
  documents?: Document[];
  createdAt?: Date;
  updatedAt?: Date;
  company: string;
  vat: number;
}