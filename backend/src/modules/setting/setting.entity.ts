import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SettingDto, SettingType } from './setting.dto';

@Entity()
export class Setting implements SettingDto {
  @PrimaryColumn()
  id: string;

  @Column()
  type: SettingType;

  @Column()
  key: string;

  @Column()
  value: string;

  @Column()
  deletable: boolean;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
