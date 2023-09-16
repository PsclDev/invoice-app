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
  dateOfIssue: string;
  description: string[];
  subTotal: number;
  tax: number;
  taxRate: number;
  total: number;
  alreadyPaid: number;
  dueDate: string;
  createdAt?: string;
  updatedAt?: string;
}

export type DocumentForm = Omit<
  Document,
  | 'id'
  | 'clientId'
  | 'invoiceId'
  | 'filepath'
  | 'description'
  | 'createdAt'
  | 'updatedAt'
> & {
  description: string;
};
