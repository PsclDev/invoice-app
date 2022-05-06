export enum DocumentType {
  OFFER = 'offer',
  INVOICE = 'invoice',
}
export interface DocumentInterface {
  id: string;
  clientId: string;
  offerNr?: number;
  invoiceNr?: number;
  invoiceId?: number;
  dateOfIssue: Date;
  description: string[];
  subTotal: number;
  tax: number;
  taxRate: number;
  alreadyPaid?: number;
  total: number;
  dueDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
