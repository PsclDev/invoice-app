import { ChildEntity, Column, CreateDateColumn, Entity, PrimaryColumn, TableInheritance, UpdateDateColumn } from 'typeorm';
import { DocumentBaseDto, InvoiceDto, OfferDto } from './document.dto';

@Entity()
@TableInheritance({ column: { type: "varchar", name: "type" } })
export class Document implements DocumentBaseDto {
  @PrimaryColumn()
  id: string;

  @Column()
  client: string;

  @Column()
  dateOfIssue: Date;

  @Column("text", {array: true})
  description: string[];  

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}

@ChildEntity()
export class Offer extends Document implements OfferDto{  
  @Column('numeric')
  subTotal: number;

  @Column('numeric')
  tax: number;

  @Column('numeric')
  total: number; 
}

@ChildEntity()
export class Invoice extends Document implements InvoiceDto {
  @Column()
  invoiceId: number;

  @Column('numeric')
  subTotal: number;
  
  @Column('numeric')
  tax: number;

  @Column('numeric', { nullable: true })  
  alreadyPaid: number;

  @Column('numeric')
  total: number;

  @Column()
  dueDate: Date;
}