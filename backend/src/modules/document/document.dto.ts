import { DocumentType } from '@helper';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export interface DocumentBaseDto {
  id: string;
  type: DocumentType;
  filepath: string;
  clientId: string;
  dateOfIssue: Date;
  description: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface OfferDto extends DocumentBaseDto {
  offerNr: number;
  invoiceId: string;
  subTotal: number;
  tax: number;
  taxRate: number;
  total: number;
}

export interface InvoiceDto extends DocumentBaseDto {
  offerId: string;
  invoiceNr: number;
  subTotal: number;
  tax: number;
  taxRate: number;
  alreadyPaid: number;
  total: number;
  dueDate: Date;
}

export type DocumentDto = OfferDto | InvoiceDto;

export class CreateOfferDto
  implements
    Omit<
      OfferDto,
      'id' | 'type' | 'filepath' | 'invoiceId' | 'createdAt' | 'updatedAt'
    >
{
  @ApiProperty()
  @IsDateString()
  dateOfIssue: Date;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  clientId: string;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  offerNr: number;

  @ApiProperty({ type: 'string[]' })
  @IsString({ each: true })
  @IsNotEmpty()
  description: string[];

  @ApiProperty()
  @IsNumber()
  subTotal: number;

  @ApiProperty()
  @IsNumber()
  tax: number;

  @ApiProperty()
  @IsNumber()
  taxRate: number;

  @ApiProperty()
  @IsNumber()
  total: number;
}

export class UpdateOfferDto extends PartialType(CreateOfferDto) {}

export class CreateInvoiceDto
  implements
    Omit<
      InvoiceDto,
      'id' | 'type' | 'filepath' | 'offerId' | 'createdAt' | 'updatedAt'
    >
{
  @ApiProperty()
  @IsNumber()
  @Min(1)
  invoiceNr: number;

  @ApiProperty()
  @IsDateString()
  dateOfIssue: Date;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  clientId: string;

  @ApiProperty({ type: 'string[]' })
  @IsString({ each: true })
  description: string[];

  @ApiProperty()
  @IsNumber()
  @Min(0)
  subTotal: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  tax: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  taxRate: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  @IsOptional()
  alreadyPaid: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  total: number;

  @ApiProperty()
  @IsDateString()
  dueDate: Date;
}

export class UpdateInvoiceDto extends PartialType(CreateInvoiceDto) {}
