import { Exclude } from 'class-transformer';
import { Client } from '../client/client.entity';
import {
  ChildEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
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
  @Column('numeric')
  subTotal: number;

  @Column('numeric')
  tax: number;

  @Column('numeric')
  total: number;
}

@ChildEntity()
export class Invoice extends Document implements InvoiceDto {
  @Column({ unique: true })
  invoiceNr: number;

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
