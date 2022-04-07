import { Document } from 'document/document.entity';
import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

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
  @IsIn([Gender.MALE, Gender.FEMALE, Gender.DIVERS])
  gender: Gender;

  @IsString()
  @IsNotEmpty()
  firstname: string;

  @IsString()
  @IsNotEmpty()
  lastname: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsNotEmpty()
  street: string;

  @IsString()
  postalCode: string;

  @IsString()
  @IsNotEmpty()
  city: string;
}

export class UpdateClientDto implements Partial<CreateClientDto> {}

export class CreateCompanyClientDto
  implements
    Omit<CompanyClientDto, 'id' | 'documents' | 'createdAt' | 'updatedAt'>
{
  @IsString()
  @IsNotEmpty()
  company: string;

  @IsString()
  @IsOptional()
  vat: string;

  @IsIn([Gender.MALE, Gender.FEMALE, Gender.DIVERS])
  gender: Gender;

  @IsString()
  @IsNotEmpty()
  firstname: string;

  @IsString()
  @IsNotEmpty()
  lastname: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsNotEmpty()
  street: string;

  @IsString()
  postalCode: string;

  @IsString()
  @IsNotEmpty()
  city: string;
}

export class UpdateCompanyClientDto
  implements Partial<CreateCompanyClientDto> {}
