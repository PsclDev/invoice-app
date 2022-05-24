import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSettingEntity1652810578693 implements MigrationInterface {
  name = 'CreateSettingEntity1652810578693';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "setting" ("id" character varying NOT NULL, "type" character varying NOT NULL, "key" character varying NOT NULL, "value" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_fcb21187dc6094e24a48f677bed" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "setting"`);
  }
}
