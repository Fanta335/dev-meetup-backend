import {MigrationInterface, QueryRunner} from "typeorm";

export class ChangeUserTable1648089682633 implements MigrationInterface {
    name = 'ChangeUserTable1648089682633'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD UNIQUE INDEX \`IDX_6594e369122d1c19184db3f815\` (\`subId\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP INDEX \`IDX_6594e369122d1c19184db3f815\``);
    }

}
