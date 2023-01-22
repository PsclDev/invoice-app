import { SettingKeyType, SettingInputType, SettingType } from '@helper';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SettingDto } from './setting.dto';

@Entity()
export class Setting implements SettingDto {
  @PrimaryColumn()
  id: string;

  @Column()
  type: SettingType;

  @Column()
  key: SettingKeyType;

  @Column()
  title: string;

  @Column()
  value: string;

  @Column()
  inputType: SettingInputType;

  @Column({ nullable: true })
  inputMask?: string;

  @Column()
  deletable: boolean;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
