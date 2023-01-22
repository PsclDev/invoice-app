import { MigrationInterface, QueryRunner } from 'typeorm';

export class SettingsRefactor1674412138947 implements MigrationInterface {
  name = 'SettingsRefactor1674412138947';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`TRUNCATE TABLE "setting"`);

    await queryRunner.query(
      `ALTER TABLE "setting" ADD "title" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "setting" ADD "inputType" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "setting" ADD "inputMask" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "setting" DROP COLUMN "inputMask"`);
    await queryRunner.query(`ALTER TABLE "setting" DROP COLUMN "inputType"`);
    await queryRunner.query(`ALTER TABLE "setting" DROP COLUMN "title"`);
  }
}
