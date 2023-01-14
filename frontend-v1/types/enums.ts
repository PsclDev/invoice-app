export enum DateTimeFormat {
  FULL = 'FULL',
  DATE = 'DATE',
  TIME = 'TIME',
}

export enum ViewMode {
  SHOW = 'SHOW',
  EDIT = 'EDIT',
  DELETE = 'DELETE',
}

export enum ClientType {
  PRIVATE = 'private',
  COMPANY = 'company',
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  DIVERS = 'DIVERS',
}

export enum DocumentType {
  OFFER = 'offer',
  INVOICE = 'invoice',
}

export enum SettingType {
  PDF = 'PDF',
  MAIL = 'MAIL',
}

export type AppEnums =
  | DateTimeFormat
  | ViewMode
  | ClientType
  | Gender
  | DocumentType
  | SettingType;
