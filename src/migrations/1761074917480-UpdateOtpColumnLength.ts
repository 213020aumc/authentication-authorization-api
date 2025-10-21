import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateOtpColumnLength1761074917480 implements MigrationInterface {
    name = 'UpdateOtpColumnLength1761074917480'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "otp"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "otp" character varying(64)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "otp"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "otp" character varying(6)`);
    }

}
