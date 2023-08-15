export enum DocumentType {
  OFFER = 'Offer',
  INVOICE = 'Invoice',
}

export interface Document {
  id: string;
  type: DocumentType;
  offerNr: number;
  invoiceNr: number;
  invoiceId: string;
  filepath: string;
  clientId: string;
  dateOfIssue: Date;
  description: string[];
  subTotal: number;
  tax: number;
  taxRate: number;
  total: number;
  alreadyPaid: number;
  dueDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
