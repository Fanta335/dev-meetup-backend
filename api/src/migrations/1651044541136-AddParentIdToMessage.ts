import {MigrationInterface, QueryRunner} from "typeorm";

export class AddParentIdToMessage1651044541136 implements MigrationInterface {
    name = 'AddParentIdToMessage1651044541136'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`FK_b1c0c3e14d1a8be95531f29eb70\` ON \`message\``);
        await queryRunner.query(`ALTER TABLE \`message\` ADD CONSTRAINT \`FK_b1c0c3e14d1a8be95531f29eb70\` FOREIGN KEY (\`parentId\`) REFERENCES \`message\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`message\` DROP FOREIGN KEY \`FK_b1c0c3e14d1a8be95531f29eb70\``);
        await queryRunner.query(`CREATE INDEX \`FK_b1c0c3e14d1a8be95531f29eb70\` ON \`message\` (\`parentId\`)`);
    }

}
