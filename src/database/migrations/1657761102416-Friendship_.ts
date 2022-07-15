import { MigrationInterface, QueryRunner } from "typeorm";

export class Friendship_1657761102416 implements MigrationInterface {
  name = "Friendship_1657761102416";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "posts" RENAME COLUMN "content" TO "text"`
    );
    await queryRunner.query(
      `CREATE TABLE "friend_relation" ("id" SERIAL NOT NULL, CONSTRAINT "PK_1ac5097e85a5201a7e28c97d3c0" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "friend_request" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_4c9d23ff394888750cf66cac17c" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "friendship" ("id" SERIAL NOT NULL, "senderId" integer NOT NULL, "receiverId" integer NOT NULL, "status" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_dbd6fb568cd912c5140307075cc" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1ce7870ad7e93284a3f186811f" ON "friendship" ("receiverId") `
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_deeac293b04038701bca2a0277" ON "friendship" ("senderId", "receiverId") `
    );
    await queryRunner.query(
      `ALTER TABLE "friendship" ADD CONSTRAINT "FK_e8a1f15f614d577cded58c58ee0" FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "friendship" ADD CONSTRAINT "FK_1ce7870ad7e93284a3f186811f1" FOREIGN KEY ("receiverId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "friendship" DROP CONSTRAINT "FK_1ce7870ad7e93284a3f186811f1"`
    );
    await queryRunner.query(
      `ALTER TABLE "friendship" DROP CONSTRAINT "FK_e8a1f15f614d577cded58c58ee0"`
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_deeac293b04038701bca2a0277"`
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_1ce7870ad7e93284a3f186811f"`
    );
    await queryRunner.query(`DROP TABLE "friendship"`);
    await queryRunner.query(`DROP TABLE "friend_request"`);
    await queryRunner.query(`DROP TABLE "friend_relation"`);
  }
}
