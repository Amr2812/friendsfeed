import { MigrationInterface, QueryRunner } from "typeorm";

export class FriendshipRenameTable_1657872254455 implements MigrationInterface {
  name = "FriendshipRenameTable_1657872254455";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameTable("friendship", "friendships");
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameTable("friendships", "friendship");
  }
}
