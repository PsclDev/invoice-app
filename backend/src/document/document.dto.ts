import { IsArray, IsDate, IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export interface DocumentBaseDto {
    id: string;
    client: string;
    dateOfIssue: Date,
    description: string[];
    createdAt?: Date;
    updatedAt?: Date;
}

export interface OfferDto extends DocumentBaseDto{
    subTotal: number;
    tax: number;
    total: number;
}

export interface InvoiceDto extends DocumentBaseDto{
    invoiceId: number;
    subTotal: number;
    tax: number;
    alreadyPaid: number;
    total: number;
    dueDate: Date;
}

export type DocumentDto = OfferDto | InvoiceDto;

export class CreateOfferDto implements Omit<OfferDto, 'id' | 'total' | 'createdAt' | 'updatedAt'> {
    @IsDateString()
    dateOfIssue: Date;
    
    @IsString()    
    client: string;

    @IsString({each:true})
    description: string[];

    @IsNumber()
    subTotal: number;

    @IsNumber()
    tax: number;
}

export class CreateInvoiceDto implements Omit<InvoiceDto, 'id' | 'total' | 'createdAt' | 'updatedAt'> {
    invoiceId: number;
    
    @IsDateString()
    dateOfIssue: Date;
    
    @IsString()
    @IsOptional()
    client: string;

    @IsString({each:true})
    description: string[];

    @IsNumber()
    subTotal: number;

    @IsNumber()
    tax: number;

    @IsNumber()
    @IsOptional()
    alreadyPaid: number;

    @IsDateString()
    dueDate: Date;
}