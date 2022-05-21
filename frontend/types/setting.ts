import { SettingType } from './enums';

export interface SettingInterface {
  id: string;
  type: SettingType;
  key: string;
  value: string;
  createdAt?: Date;
  updatedAt?: Date;
}
