import { MigrationInterface, QueryRunner } from 'typeorm';

export class OfferEnhancement1650569732927 implements MigrationInterface {
  name = 'OfferEnhancement1650569732927';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "document" ADD "offerNr" integer`);
    await queryRunner.query(
      `ALTER TABLE "document" ADD CONSTRAINT "UQ_eaeb61728165403e61416a9433b" UNIQUE ("offerNr")`,
    );
    await queryRunner.query(
      `ALTER TABLE "document" ADD "invoice_id" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "document" ADD CONSTRAINT "UQ_07ca1ab9a388359939b904a95a1" UNIQUE ("invoice_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "document" ADD CONSTRAINT "FK_07ca1ab9a388359939b904a95a1" FOREIGN KEY ("invoice_id") REFERENCES "document"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "document" DROP CONSTRAINT "FK_07ca1ab9a388359939b904a95a1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "document" DROP CONSTRAINT "UQ_07ca1ab9a388359939b904a95a1"`,
    );
    await queryRunner.query(`ALTER TABLE "document" DROP COLUMN "invoice_id"`);
    await queryRunner.query(
      `ALTER TABLE "document" DROP CONSTRAINT "UQ_eaeb61728165403e61416a9433b"`,
    );
    await queryRunner.query(`ALTER TABLE "document" DROP COLUMN "offerNr"`);
  }
}
