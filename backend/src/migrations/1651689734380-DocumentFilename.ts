import { MigrationInterface, QueryRunner } from 'typeorm';

export class DocumentFilename1651689734380 implements MigrationInterface {
  name = 'DocumentFilename1651689734380';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "document" ADD "filepath" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "document" DROP COLUMN "filepath"`);
  }
}
