import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedClientEntity1644176060000 implements MigrationInterface {
  name = 'AddedClientEntity1644176060000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "client" ("id" character varying NOT NULL, "gender" character varying NOT NULL, "firstname" character varying NOT NULL, "lastname" character varying NOT NULL, "email" character varying, "street" character varying NOT NULL, "postalCode" integer NOT NULL, "city" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "company" character varying, "vat" integer, "type" character varying NOT NULL, CONSTRAINT "PK_96da49381769303a6515a8785c7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6081e661a0bd5aef91f5da7c09" ON "client" ("type") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_6081e661a0bd5aef91f5da7c09"`,
    );
    await queryRunner.query(`DROP TABLE "client"`);
  }
}
