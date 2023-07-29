import { Document } from '@modules/document/document.entity';
import { CreateDateColumn, Entity, OneToOne, PrimaryColumn } from 'typeorm';

@Entity('mail_queue')
export class QueueItem {
  @PrimaryColumn()
  @OneToOne(() => Document, (doc) => doc.id, { nullable: false })
  documentId!: string;

  @CreateDateColumn()
  queuedAt?: Date;
}
