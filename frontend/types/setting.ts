export enum SettingType {
  PDF = 'PDF',
  MAIL = 'MAIL',
}

export interface SettingInterface {
  id: string;
  type: SettingType;
  key: string;
  value: string;
  createdAt?: Date;
  updatedAt?: Date;
}
