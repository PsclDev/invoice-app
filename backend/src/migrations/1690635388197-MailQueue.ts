import { MigrationInterface, QueryRunner } from 'typeorm';

export class MailQueue1690635388197 implements MigrationInterface {
  name = 'MailQueue1690635388197';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "mail_queue" ("documentId" character varying NOT NULL, "queuedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a291c183de79841f535829ac3f4" PRIMARY KEY ("documentId"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "mail_queue"`);
  }
}
