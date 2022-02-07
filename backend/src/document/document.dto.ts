import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export interface DocumentBaseDto {
  id: string;
  clientId: string;
  dateOfIssue: Date;
  description: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface OfferDto extends DocumentBaseDto {
  subTotal: number;
  tax: number;
  total: number;
}

export interface InvoiceDto extends DocumentBaseDto {
  invoiceNr: number;
  subTotal: number;
  tax: number;
  alreadyPaid: number;
  total: number;
  dueDate: Date;
}

export type DocumentDto = OfferDto | InvoiceDto;

export class CreateOfferDto
  implements Omit<OfferDto, 'id' | 'createdAt' | 'updatedAt'>
{
  @IsDateString()
  dateOfIssue: Date;

  @IsString()
  @IsNotEmpty()
  clientId: string;

  @IsString({ each: true })
  @IsNotEmpty()
  description: string[];

  @IsNumber()
  subTotal: number;

  @IsNumber()
  tax: number;

  @IsNumber()
  total: number;
}

export class UpdateOfferDto implements Partial<CreateOfferDto> {}

export class CreateInvoiceDto
  implements Omit<InvoiceDto, 'id' | 'createdAt' | 'updatedAt'>
{
  @IsNumber()
  invoiceNr: number;

  @IsDateString()
  dateOfIssue: Date;

  @IsString()
  @IsOptional()
  clientId: string;

  @IsString({ each: true })
  description: string[];

  @IsNumber()
  subTotal: number;

  @IsNumber()
  tax: number;

  @IsNumber()
  @IsOptional()
  alreadyPaid: number;

  @IsNumber()
  total: number;

  @IsDateString()
  dueDate: Date;
}

export class UpdateInvoiceDto implements Partial<CreateInvoiceDto> {}
