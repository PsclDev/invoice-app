import { MigrationInterface, QueryRunner } from 'typeorm';

export class EnhancedSettings1653556850334 implements MigrationInterface {
  name = 'EnhancedSettings1653556850334';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "setting" ADD "deletable" boolean NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "setting" DROP COLUMN "deletable"`);
  }
}
