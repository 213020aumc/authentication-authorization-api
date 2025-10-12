import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPasswordChangedAtToUser1760266685457 implements MigrationInterface {
    name = 'AddPasswordChangedAtToUser1760266685457'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "passwordChangedAt" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "passwordChangedAt"`);
    }

}
