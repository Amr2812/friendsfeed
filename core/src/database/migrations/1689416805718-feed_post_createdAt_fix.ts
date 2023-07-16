import {MigrationInterface, QueryRunner} from "typeorm";

export class feedPostCreatedAtFix1689416805718 implements MigrationInterface {
    name = 'feedPostCreatedAtFix1689416805718'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "feed_posts" RENAME COLUMN "creattedAt" TO "createdAt"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "feed_posts" RENAME COLUMN "createdAt" TO "creattedAt"`);
    }

}
