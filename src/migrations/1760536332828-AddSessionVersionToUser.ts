import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSessionVersionToUser1760536332828 implements MigrationInterface {
    name = 'AddSessionVersionToUser1760536332828'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "sessionVersion" uuid`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "sessionVersion"`);
    }

}
