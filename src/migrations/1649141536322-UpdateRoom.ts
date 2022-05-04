import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateRoom1649141536322 implements MigrationInterface {
    name = 'UpdateRoom1649141536322'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`photo\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(500) NOT NULL, \`userId\` int NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`subId\` varchar(24) NOT NULL, \`name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, UNIQUE INDEX \`IDX_6594e369122d1c19184db3f815\` (\`subId\`), UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`room\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`message\` (\`id\` int NOT NULL AUTO_INCREMENT, \`authorId\` int NOT NULL, \`roomId\` int NOT NULL, \`content\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`parentId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`ownership\` (\`ownerId\` int NOT NULL, \`roomId\` int NOT NULL, INDEX \`IDX_8e300e344e94f25ed8a346d810\` (\`ownerId\`), INDEX \`IDX_8521ae8ea6342ae4c82a676ae1\` (\`roomId\`), PRIMARY KEY (\`ownerId\`, \`roomId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`belonging\` (\`memberId\` int NOT NULL, \`roomId\` int NOT NULL, INDEX \`IDX_8f775fe46a93313acc8d82a816\` (\`memberId\`), INDEX \`IDX_73abc66b151ad718f5247160dd\` (\`roomId\`), PRIMARY KEY (\`memberId\`, \`roomId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`photo\` ADD CONSTRAINT \`FK_4494006ff358f754d07df5ccc87\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`message\` ADD CONSTRAINT \`FK_b1c0c3e14d1a8be95531f29eb70\` FOREIGN KEY (\`parentId\`) REFERENCES \`message\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`message\` ADD CONSTRAINT \`FK_c72d82fa0e8699a141ed6cc41b3\` FOREIGN KEY (\`authorId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`message\` ADD CONSTRAINT \`FK_fdfe54a21d1542c564384b74d5c\` FOREIGN KEY (\`roomId\`) REFERENCES \`room\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`ownership\` ADD CONSTRAINT \`FK_8e300e344e94f25ed8a346d810b\` FOREIGN KEY (\`ownerId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`ownership\` ADD CONSTRAINT \`FK_8521ae8ea6342ae4c82a676ae14\` FOREIGN KEY (\`roomId\`) REFERENCES \`room\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`belonging\` ADD CONSTRAINT \`FK_8f775fe46a93313acc8d82a8165\` FOREIGN KEY (\`memberId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`belonging\` ADD CONSTRAINT \`FK_73abc66b151ad718f5247160ddd\` FOREIGN KEY (\`roomId\`) REFERENCES \`room\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`belonging\` DROP FOREIGN KEY \`FK_73abc66b151ad718f5247160ddd\``);
        await queryRunner.query(`ALTER TABLE \`belonging\` DROP FOREIGN KEY \`FK_8f775fe46a93313acc8d82a8165\``);
        await queryRunner.query(`ALTER TABLE \`ownership\` DROP FOREIGN KEY \`FK_8521ae8ea6342ae4c82a676ae14\``);
        await queryRunner.query(`ALTER TABLE \`ownership\` DROP FOREIGN KEY \`FK_8e300e344e94f25ed8a346d810b\``);
        await queryRunner.query(`ALTER TABLE \`message\` DROP FOREIGN KEY \`FK_fdfe54a21d1542c564384b74d5c\``);
        await queryRunner.query(`ALTER TABLE \`message\` DROP FOREIGN KEY \`FK_c72d82fa0e8699a141ed6cc41b3\``);
        await queryRunner.query(`ALTER TABLE \`message\` DROP FOREIGN KEY \`FK_b1c0c3e14d1a8be95531f29eb70\``);
        await queryRunner.query(`ALTER TABLE \`photo\` DROP FOREIGN KEY \`FK_4494006ff358f754d07df5ccc87\``);
        await queryRunner.query(`DROP INDEX \`IDX_73abc66b151ad718f5247160dd\` ON \`belonging\``);
        await queryRunner.query(`DROP INDEX \`IDX_8f775fe46a93313acc8d82a816\` ON \`belonging\``);
        await queryRunner.query(`DROP TABLE \`belonging\``);
        await queryRunner.query(`DROP INDEX \`IDX_8521ae8ea6342ae4c82a676ae1\` ON \`ownership\``);
        await queryRunner.query(`DROP INDEX \`IDX_8e300e344e94f25ed8a346d810\` ON \`ownership\``);
        await queryRunner.query(`DROP TABLE \`ownership\``);
        await queryRunner.query(`DROP TABLE \`message\``);
        await queryRunner.query(`DROP TABLE \`room\``);
        await queryRunner.query(`DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``);
        await queryRunner.query(`DROP INDEX \`IDX_6594e369122d1c19184db3f815\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
        await queryRunner.query(`DROP TABLE \`photo\``);
    }

}
