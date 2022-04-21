import { Exclude } from 'class-transformer';
import { Client } from '../client/client.entity';
import {
  ChildEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
  TableInheritance,
  UpdateDateColumn,
} from 'typeorm';
import { DocumentBaseDto, InvoiceDto, OfferDto } from './document.dto';

@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export class Document implements DocumentBaseDto {
  @PrimaryColumn()
  id: string;

  @Column()
  invoiceNr: number;

  @Column({ name: 'client_id' })
  clientId: string;

  @ManyToOne(() => Client, (client) => client.documents, { nullable: true })
  @JoinColumn({ name: 'client_id' })
  @Exclude()
  client!: Client | null;

  @Column()
  dateOfIssue: Date;

  @Column('text', { array: true })
  description: string[];

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}

@ChildEntity()
export class Offer extends Document implements OfferDto {
  @Column({ unique: true })
  offerNr: number;

  @OneToOne(() => Invoice, (invoice) => invoice.offerId, { nullable: true })
  @JoinColumn({ name: 'invoice_id' })
  invoiceId: string;

  @Column('numeric')
  subTotal: number;

  @Column('numeric')
  tax: number;

  @Column('numeric')
  taxRate: number;

  @Column('numeric')
  total: number;
}

@ChildEntity()
export class Invoice extends Document implements InvoiceDto {
  @OneToOne(() => Offer, (offer) => offer.invoiceId, { nullable: true })
  @Exclude()
  offerId: string;

  @Column({ unique: true })
  invoiceNr: number;

  @Column('numeric')
  subTotal: number;

  @Column('numeric')
  tax: number;

  @Column('numeric')
  taxRate: number;

  @Column('numeric', { nullable: true })
  alreadyPaid: number;

  @Column('numeric')
  total: number;

  @Column()
  dueDate: Date;
}
