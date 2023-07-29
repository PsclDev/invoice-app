import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import {
  FileKey,
  MailKey,
  PdfKey,
  SettingInputType,
  SettingKeyType,
  SettingType,
} from './setting.types';

export interface SettingDto {
  id: string;
  type: SettingType;
  key: SettingKeyType;
  title: string;
  value: string;
  inputType: SettingInputType;
  inputMask?: string;
  deletable: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class CreateSettingDto
  implements Omit<SettingDto, 'id' | 'deletable' | 'createdAt' | 'updatedAt'>
{
  @ApiProperty({ enum: ['PDF', 'MAIL'] })
  @IsIn([SettingType.PDF, SettingType.MAIL])
  type: SettingType;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  key: PdfKey | MailKey | FileKey;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  value: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  inputType: SettingInputType;

  @ApiProperty()
  @IsString()
  @IsOptional()
  inputMask?: string;
}

export class UpdateSettingDto extends PartialType(CreateSettingDto) {}
