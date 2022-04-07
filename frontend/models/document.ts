import { DocumentInterface } from '~/types/document';

export class Document implements DocumentInterface {
  id!: string;
  clientId!: string;
  invoiceNr?: number;
  dateOfIssue!: Date;
  description!: string[];
  subTotal!: number;
  tax!: number;
  alreadyPaid?: number;
  total!: number;
  dueDate?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
