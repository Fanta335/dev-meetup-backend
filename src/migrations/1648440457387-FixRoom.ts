import {MigrationInterface, QueryRunner} from "typeorm";

export class FixRoom1648440457387 implements MigrationInterface {
    name = 'FixRoom1648440457387'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`ownership\` (\`ownerId\` int NOT NULL, \`roomId\` int NOT NULL, INDEX \`IDX_8e300e344e94f25ed8a346d810\` (\`ownerId\`), INDEX \`IDX_8521ae8ea6342ae4c82a676ae1\` (\`roomId\`), PRIMARY KEY (\`ownerId\`, \`roomId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`belonging\` (\`memberId\` int NOT NULL, \`roomId\` int NOT NULL, INDEX \`IDX_8f775fe46a93313acc8d82a816\` (\`memberId\`), INDEX \`IDX_73abc66b151ad718f5247160dd\` (\`roomId\`), PRIMARY KEY (\`memberId\`, \`roomId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`photo\` ADD \`deletedAt\` datetime(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`deletedAt\` datetime(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`room\` ADD \`ownerId\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`room\` ADD \`memberId\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`room\` ADD \`deletedAt\` datetime(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`message\` ADD \`deletedAt\` datetime(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`ownership\` ADD CONSTRAINT \`FK_8e300e344e94f25ed8a346d810b\` FOREIGN KEY (\`ownerId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`ownership\` ADD CONSTRAINT \`FK_8521ae8ea6342ae4c82a676ae14\` FOREIGN KEY (\`roomId\`) REFERENCES \`room\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`belonging\` ADD CONSTRAINT \`FK_8f775fe46a93313acc8d82a8165\` FOREIGN KEY (\`memberId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`belonging\` ADD CONSTRAINT \`FK_73abc66b151ad718f5247160ddd\` FOREIGN KEY (\`roomId\`) REFERENCES \`room\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`belonging\` DROP FOREIGN KEY \`FK_73abc66b151ad718f5247160ddd\``);
        await queryRunner.query(`ALTER TABLE \`belonging\` DROP FOREIGN KEY \`FK_8f775fe46a93313acc8d82a8165\``);
        await queryRunner.query(`ALTER TABLE \`ownership\` DROP FOREIGN KEY \`FK_8521ae8ea6342ae4c82a676ae14\``);
        await queryRunner.query(`ALTER TABLE \`ownership\` DROP FOREIGN KEY \`FK_8e300e344e94f25ed8a346d810b\``);
        await queryRunner.query(`ALTER TABLE \`message\` DROP COLUMN \`deletedAt\``);
        await queryRunner.query(`ALTER TABLE \`room\` DROP COLUMN \`deletedAt\``);
        await queryRunner.query(`ALTER TABLE \`room\` DROP COLUMN \`memberId\``);
        await queryRunner.query(`ALTER TABLE \`room\` DROP COLUMN \`ownerId\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`deletedAt\``);
        await queryRunner.query(`ALTER TABLE \`photo\` DROP COLUMN \`deletedAt\``);
        await queryRunner.query(`DROP INDEX \`IDX_73abc66b151ad718f5247160dd\` ON \`belonging\``);
        await queryRunner.query(`DROP INDEX \`IDX_8f775fe46a93313acc8d82a816\` ON \`belonging\``);
        await queryRunner.query(`DROP TABLE \`belonging\``);
        await queryRunner.query(`DROP INDEX \`IDX_8521ae8ea6342ae4c82a676ae1\` ON \`ownership\``);
        await queryRunner.query(`DROP INDEX \`IDX_8e300e344e94f25ed8a346d810\` ON \`ownership\``);
        await queryRunner.query(`DROP TABLE \`ownership\``);
    }

}
