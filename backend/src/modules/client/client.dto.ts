import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

import { Document } from '../document/document.entity';

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  DIVERS = 'DIVERS',
}

export interface ClientBaseDto {
  id: string;
  gender: Gender;
  firstname: string;
  lastname: string;
  email: string;
  street: string;
  postalCode: string;
  city: string;
  documents?: Document[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CompanyClientDto extends ClientBaseDto {
  company: string;
  vat: string;
}

export type ClientDto = ClientBaseDto | CompanyClientDto;

export class CreateClientDto
  implements
    Omit<ClientBaseDto, 'id' | 'documents' | 'createdAt' | 'updatedAt'>
{
  @ApiProperty({ enum: ['MALE', 'FEMALE', 'DIVERS'] })
  @IsIn([Gender.MALE, Gender.FEMALE, Gender.DIVERS])
  gender: Gender;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  firstname: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lastname: string;

  @ApiProperty()
  @IsEmail()
  @IsOptional()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  street: string;

  @ApiProperty()
  @IsString()
  postalCode: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  city: string;
}

export class UpdateClientDto extends PartialType(CreateClientDto) {}

export class CreateCompanyClientDto
  implements
    Omit<CompanyClientDto, 'id' | 'documents' | 'createdAt' | 'updatedAt'>
{
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  company: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  vat: string;

  @ApiProperty({ enum: ['MALE', 'FEMALE', 'DIVERS'] })
  @IsIn([Gender.MALE, Gender.FEMALE, Gender.DIVERS])
  gender: Gender;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  firstname: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lastname: string;

  @ApiProperty()
  @IsEmail()
  @IsOptional()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  street: string;

  @ApiProperty()
  @IsString()
  postalCode: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  city: string;
}

export class UpdateCompanyClientDto extends PartialType(
  CreateCompanyClientDto,
) {}
