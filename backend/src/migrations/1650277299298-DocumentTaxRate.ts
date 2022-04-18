import { MigrationInterface, QueryRunner } from 'typeorm';

export class DocumentTaxRate1650277299298 implements MigrationInterface {
  name = 'DocumentTaxRate1650277299298';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "document" ADD "taxRate" numeric`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "document" DROP COLUMN "taxRate"`);
  }
}
