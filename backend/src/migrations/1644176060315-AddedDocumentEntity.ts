import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedDocumentEntity1644176060315 implements MigrationInterface {
  name = 'AddedDocumentEntity1644176060315';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "document" ("id" character varying NOT NULL, "client_id" character varying NOT NULL, "dateOfIssue" TIMESTAMP NOT NULL, "description" text array NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "subTotal" numeric, "tax" numeric, "total" numeric, "invoiceNr" integer, "alreadyPaid" numeric, "dueDate" TIMESTAMP, "type" character varying NOT NULL, CONSTRAINT "UQ_5abb222c416a81f1ea647de6db7" UNIQUE ("invoiceNr"), CONSTRAINT "PK_e57d3357f83f3cdc0acffc3d777" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c450d8db7e107a6182ff13b151" ON "document" ("type") `,
    );

    await queryRunner.query(
      `ALTER TABLE "document" ADD "client" character varying`,
    );

    await queryRunner.query(
      `ALTER TABLE "document" ADD CONSTRAINT "FK_69829ffa7becbba27900de9233a" FOREIGN KEY ("client_id") REFERENCES "client"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "document" DROP CONSTRAINT "FK_69829ffa7becbba27900de9233a"`,
    );

    await queryRunner.query(
      `ALTER TABLE "document" ADD "client_id" character varying NOT NULL`,
    );

    await queryRunner.query(
      `DROP INDEX "public"."IDX_c450d8db7e107a6182ff13b151"`,
    );
    await queryRunner.query(`DROP TABLE "document"`);
  }
}
