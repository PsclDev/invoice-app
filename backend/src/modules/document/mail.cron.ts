import { MailService } from '@modules/mail';
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { QueueItem } from './queue.entity';
import { DocumentService } from './services';

@Injectable()
export class MailCronJob {
  private readonly logger = new Logger(MailCronJob.name);

  constructor(
    private readonly documentService: DocumentService,
    private readonly mailService: MailService,
    @InjectRepository(QueueItem)
    private queueRepository: Repository<QueueItem>,
  ) {}

  @Cron('0 8 * * *')
  async handleCron() {
    const documentIds = await this.queueRepository.find();
    this.logger.debug(
      `Trying to deliver delayed documents, count: ${documentIds.length}`,
    );

    for (const { documentId } of documentIds) {
      await this.documentService.mail(documentId, undefined);
      await this.mailService.removeFromQueue(documentId);
    }
  }
}
