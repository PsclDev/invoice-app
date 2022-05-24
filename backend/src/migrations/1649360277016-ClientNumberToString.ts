import { MigrationInterface, QueryRunner } from 'typeorm';

export class ClientNumberToString1649360277016 implements MigrationInterface {
  name = 'ClientNumberToString1649360277016';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "document" DROP COLUMN "client"`);
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "postalCode"`);
    await queryRunner.query(
      `ALTER TABLE "client" ADD "postalCode" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "vat"`);
    await queryRunner.query(`ALTER TABLE "client" ADD "vat" character varying`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "vat"`);
    await queryRunner.query(`ALTER TABLE "client" ADD "vat" integer`);
    await queryRunner.query(`ALTER TABLE "client" DROP COLUMN "postalCode"`);
    await queryRunner.query(
      `ALTER TABLE "client" ADD "postalCode" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "document" ADD "client" character varying`,
    );
  }
}
