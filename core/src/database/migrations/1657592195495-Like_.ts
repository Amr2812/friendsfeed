import { MigrationInterface, QueryRunner } from "typeorm";

export class Like_1657592195495 implements MigrationInterface {
  name = "Like_1657592195495";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "posts_likes" ("id" SERIAL NOT NULL, "postId" integer NOT NULL, "userId" integer, CONSTRAINT "PK_2038d34048d51b766bca272ff5e" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "posts_likes" ADD CONSTRAINT "FK_68782d7b004ae8d49108fb543e8" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "posts_likes" ADD CONSTRAINT "FK_52124241376befa05bb3b974009" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "posts_likes" DROP CONSTRAINT "FK_52124241376befa05bb3b974009"`
    );
    await queryRunner.query(
      `ALTER TABLE "posts_likes" DROP CONSTRAINT "FK_68782d7b004ae8d49108fb543e8"`
    );
    await queryRunner.query(`DROP TABLE "posts_likes"`);
  }
}
