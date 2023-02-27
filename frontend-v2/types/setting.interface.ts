export interface SettingResponse {
  id: string;
  type: SettingType;
  key: string;
  title: string;
  value: string;
  inputType: SettingInputType;
  inputMask?: string;
  deletable: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export type SettingInputType = 'string' | 'number';

export enum SettingType {
  PDF = 'PDF',
  MAIL = 'MAIL',
  FILE = 'FILE'
}
