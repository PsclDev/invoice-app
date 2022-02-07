import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPostalCode,
  IsString,
  MaxLength,
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
  postalCode: number;
  city: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CompanyClientDto extends ClientBaseDto {
  company: string;
  vat: number;
}

export type ClientDto = ClientBaseDto | CompanyClientDto;

export class CreateClientDto
  implements Omit<ClientBaseDto, 'id' | 'createdAt' | 'updatedAt'>
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

  @IsNumber()
  postalCode: number;

  @IsString()
  @IsNotEmpty()
  city: string;
}

export class UpdateClientDto implements Partial<CreateClientDto> {}

export class CreateCompanyClientDto
  implements Omit<CompanyClientDto, 'id' | 'createdAt' | 'updatedAt'>
{
  @IsString()
  @IsNotEmpty()
  company: string;

  @IsNumber()
  @IsOptional()
  vat: number;

  @IsIn([Gender.MALE, Gender.FEMALE, Gender.DIVERS])
  gender: Gender;

  @IsString()
  @IsNotEmpty()
  firstname: string;

  @IsString()
  @IsNotEmpty()
  lastname: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  street: string;

  @IsNumber()
  postalCode: number;

  @IsString()
  @IsNotEmpty()
  city: string;
}

export class UpdateCompanyClientDto
  implements Partial<CreateCompanyClientDto> {}