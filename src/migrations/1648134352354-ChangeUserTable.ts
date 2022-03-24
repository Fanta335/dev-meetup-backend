import {MigrationInterface, QueryRunner} from "typeorm";

export class ChangeUserTable1648134352354 implements MigrationInterface {
    name = 'ChangeUserTable1648134352354'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`photo\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(500) NOT NULL, \`userId\` int NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`subId\` varchar(24) NOT NULL, \`name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_6594e369122d1c19184db3f815\` (\`subId\`), UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`room\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`message\` (\`id\` int NOT NULL AUTO_INCREMENT, \`authorId\` int NOT NULL, \`roomId\` int NOT NULL, \`content\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`parentId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_my_rooms_room\` (\`userId\` int NOT NULL, \`roomId\` int NOT NULL, INDEX \`IDX_1336ad418a11d529cfd7aac2e1\` (\`userId\`), INDEX \`IDX_176ee6d0cad934db1603e998cb\` (\`roomId\`), PRIMARY KEY (\`userId\`, \`roomId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_rooms_room\` (\`userId\` int NOT NULL, \`roomId\` int NOT NULL, INDEX \`IDX_4031804b462cdb23799d73073c\` (\`userId\`), INDEX \`IDX_26f04118a1ad0bd2175fcf44e6\` (\`roomId\`), PRIMARY KEY (\`userId\`, \`roomId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`photo\` ADD CONSTRAINT \`FK_4494006ff358f754d07df5ccc87\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`message\` ADD CONSTRAINT \`FK_c72d82fa0e8699a141ed6cc41b3\` FOREIGN KEY (\`authorId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`message\` ADD CONSTRAINT \`FK_fdfe54a21d1542c564384b74d5c\` FOREIGN KEY (\`roomId\`) REFERENCES \`room\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`message\` ADD CONSTRAINT \`FK_b1c0c3e14d1a8be95531f29eb70\` FOREIGN KEY (\`parentId\`) REFERENCES \`message\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_my_rooms_room\` ADD CONSTRAINT \`FK_1336ad418a11d529cfd7aac2e19\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`user_my_rooms_room\` ADD CONSTRAINT \`FK_176ee6d0cad934db1603e998cbf\` FOREIGN KEY (\`roomId\`) REFERENCES \`room\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_rooms_room\` ADD CONSTRAINT \`FK_4031804b462cdb23799d73073c6\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`user_rooms_room\` ADD CONSTRAINT \`FK_26f04118a1ad0bd2175fcf44e60\` FOREIGN KEY (\`roomId\`) REFERENCES \`room\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_rooms_room\` DROP FOREIGN KEY \`FK_26f04118a1ad0bd2175fcf44e60\``);
        await queryRunner.query(`ALTER TABLE \`user_rooms_room\` DROP FOREIGN KEY \`FK_4031804b462cdb23799d73073c6\``);
        await queryRunner.query(`ALTER TABLE \`user_my_rooms_room\` DROP FOREIGN KEY \`FK_176ee6d0cad934db1603e998cbf\``);
        await queryRunner.query(`ALTER TABLE \`user_my_rooms_room\` DROP FOREIGN KEY \`FK_1336ad418a11d529cfd7aac2e19\``);
        await queryRunner.query(`ALTER TABLE \`message\` DROP FOREIGN KEY \`FK_b1c0c3e14d1a8be95531f29eb70\``);
        await queryRunner.query(`ALTER TABLE \`message\` DROP FOREIGN KEY \`FK_fdfe54a21d1542c564384b74d5c\``);
        await queryRunner.query(`ALTER TABLE \`message\` DROP FOREIGN KEY \`FK_c72d82fa0e8699a141ed6cc41b3\``);
        await queryRunner.query(`ALTER TABLE \`photo\` DROP FOREIGN KEY \`FK_4494006ff358f754d07df5ccc87\``);
        await queryRunner.query(`DROP INDEX \`IDX_26f04118a1ad0bd2175fcf44e6\` ON \`user_rooms_room\``);
        await queryRunner.query(`DROP INDEX \`IDX_4031804b462cdb23799d73073c\` ON \`user_rooms_room\``);
        await queryRunner.query(`DROP TABLE \`user_rooms_room\``);
        await queryRunner.query(`DROP INDEX \`IDX_176ee6d0cad934db1603e998cb\` ON \`user_my_rooms_room\``);
        await queryRunner.query(`DROP INDEX \`IDX_1336ad418a11d529cfd7aac2e1\` ON \`user_my_rooms_room\``);
        await queryRunner.query(`DROP TABLE \`user_my_rooms_room\``);
        await queryRunner.query(`DROP TABLE \`message\``);
        await queryRunner.query(`DROP TABLE \`room\``);
        await queryRunner.query(`DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``);
        await queryRunner.query(`DROP INDEX \`IDX_6594e369122d1c19184db3f815\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
        await queryRunner.query(`DROP TABLE \`photo\``);
    }

}
