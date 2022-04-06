import { Exclude } from 'class-transformer';
import { Document } from '../document/document.entity';
import {
  ChildEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  TableInheritance,
  UpdateDateColumn,
} from 'typeorm';
import { ClientBaseDto, CompanyClientDto, Gender } from './client.dto';

@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export class Client implements ClientBaseDto {
  @PrimaryColumn()
  id: string;

  @Column()
  gender: Gender;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column({ nullable: true })
  email: string;

  @Column()
  street: string;

  @Column()
  postalCode: number;

  @Column()
  city: string;

  @OneToMany(() => Document, (document) => document.client, { eager: true })
  @Exclude()
  documents?: Document[];

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}

@ChildEntity()
export class CompanyClient extends Client implements CompanyClientDto {
  @Column()
  company: string;

  @Column({ nullable: true })
  vat: number;

  @PrimaryColumn()
  id: string;

  @Column()
  gender: Gender;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column({ nullable: true })
  email: string;

  @Column()
  street: string;

  @Column()
  postalCode: number;

  @Column()
  city: string;

  @OneToMany(() => Document, (document) => document.client)
  @Exclude()
  documents?: Document[];

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
