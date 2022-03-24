import {MigrationInterface, QueryRunner} from "typeorm";

export class ChangeUserTable1648089314476 implements MigrationInterface {
    name = 'ChangeUserTable1648089314476'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`subId\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`subId\` varchar(30) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`subId\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`subId\` varchar(255) NOT NULL`);
    }

}
