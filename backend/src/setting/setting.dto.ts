import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export enum SettingType {
  PDF = 'PDF',
  MAIL = 'MAIL',
}

export interface SettingDto {
  id: string;
  type: SettingType;
  key: string;
  value: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class CreateSettingDto
  implements Omit<SettingDto, 'id' | 'createdAt' | 'updatedAt'>
{
  @ApiProperty({ enum: ['PDF', 'MAIL'] })
  @IsIn([SettingType.PDF, SettingType.MAIL])
  type: SettingType;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  value: string;
}

export class UpdateSettingDto extends PartialType(CreateSettingDto) {}
