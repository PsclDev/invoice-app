import { MigrationInterface, QueryRunner } from 'typeorm';

export class NumericToDecimal1714589901278 implements MigrationInterface {
  name = 'NumericToDecimal1714589901278';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "document" ALTER COLUMN "subTotal" TYPE DECIMAL(10, 2), ALTER COLUMN "tax" TYPE DECIMAL(10, 2), ALTER COLUMN "taxRate" TYPE DECIMAL(10, 2), ALTER COLUMN "alreadyPaid" TYPE DECIMAL(10, 2), ALTER COLUMN "total" TYPE DECIMAL(10, 2);`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "document" ALTER COLUMN "subTotal" TYPE NUMERIC, ALTER COLUMN "tax" TYPE NUMERIC, ALTER COLUMN "taxRate" TYPE NUMERIC, ALTER COLUMN "alreadyPaid" TYPE NUMERIC, ALTER COLUMN "total" TYPE NUMERIC;`,
    );
  }
}
