import { DocumentInterface } from '~/types/document';

export class Document implements DocumentInterface {
  id!: string;
  clientId!: string;
  offerNr?: number;
  invoiceNr?: number;
  invoiceId?: string;
  dateOfIssue!: Date;
  description!: string[];
  subTotal!: number;
  tax!: number;
  taxRate!: number;
  alreadyPaid?: number;
  total!: number;
  dueDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
