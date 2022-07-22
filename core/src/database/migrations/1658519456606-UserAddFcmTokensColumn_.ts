import {MigrationInterface, QueryRunner} from "typeorm";

export class UserAddFcmTokensColumn_1658519456606 implements MigrationInterface {
    name = 'UserAddFcmTokensColumn_1658519456606'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "friendships" DROP CONSTRAINT "FK_76977c4ed1415e3b1cdf7848a8c"`);
        await queryRunner.query(`ALTER TABLE "friendships" DROP CONSTRAINT "FK_02ebdc40b6af5b1621300a3bf38"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "fcmTokens" text array`);
        await queryRunner.query(`ALTER TABLE "friendships" ADD CONSTRAINT "FK_02ebdc40b6af5b1621300a3bf38" FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "friendships" ADD CONSTRAINT "FK_76977c4ed1415e3b1cdf7848a8c" FOREIGN KEY ("receiverId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "friendships" DROP CONSTRAINT "FK_76977c4ed1415e3b1cdf7848a8c"`);
        await queryRunner.query(`ALTER TABLE "friendships" DROP CONSTRAINT "FK_02ebdc40b6af5b1621300a3bf38"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "fcmTokens"`);
        await queryRunner.query(`ALTER TABLE "friendships" ADD CONSTRAINT "FK_02ebdc40b6af5b1621300a3bf38" FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "friendships" ADD CONSTRAINT "FK_76977c4ed1415e3b1cdf7848a8c" FOREIGN KEY ("receiverId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
