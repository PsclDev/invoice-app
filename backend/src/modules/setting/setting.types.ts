export enum SettingType {
  PDF = 'PDF',
  MAIL = 'MAIL',
  FILE = 'FILE',
  GPT = 'GPT',
}

export enum PdfKey {
  COMPANY_NAME = 'COMPANY_NAME',
  COMPANY_ADRESS = 'COMPANY_ADRESS',
  COMPANY_TAXID = 'COMPANY_TAXID',
  PAYMENT_NAME = 'PAYMENT_NAME',
  PAYMENT_IBAN = 'PAYMENT_IBAN',
}

export enum MailKey {
  INVOICE_SUBJECT = 'INVOICE_SUBJECT',
  INVOICE_TEXT = 'INVOICE_TEXT',
  OFFER_SUBJECT = 'OFFER_SUBJECT',
  OFFER_TEXT = 'OFFER_TEXT',
}

export enum FileKey {
  INVOICE_PREFIX = 'INVOICE_PREFIX',
  OFFER_PREFIX = 'OFFER_PREFIX',
  INVOICE_STARTING_NR = 'INVOICE_STARTING_NR',
  OFFER_STARTING_NR = 'OFFER_STARTING_NR',
}

export enum GptKey {
  MODEL = 'MODEL',
  PRE_PROMPT = 'PRE_PROMPT',
}

export type SettingKeyType = PdfKey | MailKey | FileKey | GptKey;
export type SettingInputType = 'text' | 'number' | 'textarea';
