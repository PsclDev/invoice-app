export interface DocumentInterface {
  id: string;
  clientId: string;
  offerNr?: number;
  invoiceNr?: number;
  invoiceId?: string;
  dateOfIssue: Date | string;
  description: string[];
  subTotal: number;
  tax: number;
  taxRate: number;
  alreadyPaid?: number;
  total: number;
  dueDate?: Date | string;
  createdAt?: Date;
  updatedAt?: Date;
}
