export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  DIVERS = 'DIVERS'
}

export interface ClientResponse {
  id: string;
  gender: Gender;
  firstname: string;
  lastname: string;
  email: string;
  street: string;
  postalCode: string;
  city: string;
  documents?: Document[];
  company?: string;
  vat?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
