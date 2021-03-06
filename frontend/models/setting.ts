import { SettingType } from '~/types';
import { SettingInterface } from '~/types/setting';

export class Setting implements SettingInterface {
  id!: string;
  type!: SettingType;
  key!: string;
  value!: string;
  deletable!: boolean;
  createdAt?: Date | undefined;
  updatedAt?: Date | undefined;
}
