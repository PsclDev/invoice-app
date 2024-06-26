import { ColumnNumericTransformer } from '@utils';
import { Exclude } from 'class-transformer';
import {
  ChildEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
  RelationId,
  TableInheritance,
  UpdateDateColumn,
} from 'typeorm';

import { Client } from '../client/client.entity';
import { DocumentBaseDto, InvoiceDto, OfferDto } from './document.dto';
import { DocumentType } from './document.types';

@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export class Document implements DocumentBaseDto {
  @PrimaryColumn()
  id: string;

  @Column()
  type: DocumentType;

  @Column({ nullable: true })
  filepath: string;

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
  @Column()
  type: DocumentType.OFFER;

  @Column({ unique: true })
  offerNr: number;

  @OneToOne(() => Invoice, (invoice) => invoice.offerId, {
    nullable: true,
  })
  @JoinColumn({ name: 'invoice_id' })
  invoice: InvoiceDto;

  @RelationId((offer: Offer) => offer.invoice)
  invoiceId: string;

  @Column('decimal', { transformer: new ColumnNumericTransformer() })
  subTotal: number;

  @Column('decimal', { transformer: new ColumnNumericTransformer() })
  tax: number;

  @Column('decimal', { transformer: new ColumnNumericTransformer() })
  taxRate: number;

  @Column('decimal', { transformer: new ColumnNumericTransformer() })
  total: number;
}

@ChildEntity()
export class Invoice extends Document implements InvoiceDto {
  @Column()
  type: DocumentType.INVOICE;

  @OneToOne(() => Offer, (offer) => offer.invoiceId, { nullable: true })
  @Exclude()
  offerId: string;

  @Column({ unique: true })
  invoiceNr: number;

  @Column('decimal', { transformer: new ColumnNumericTransformer() })
  subTotal: number;

  @Column('decimal', { transformer: new ColumnNumericTransformer() })
  tax: number;

  @Column('decimal', { transformer: new ColumnNumericTransformer() })
  taxRate: number;

  @Column('decimal', {
    nullable: true,
    transformer: new ColumnNumericTransformer(),
  })
  alreadyPaid: number;

  @Column('decimal', { transformer: new ColumnNumericTransformer() })
  total: number;

  @Column()
  dueDate: Date;
}
