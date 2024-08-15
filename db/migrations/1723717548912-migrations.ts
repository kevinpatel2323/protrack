import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1723717548912 implements MigrationInterface {
    name = 'Migrations1723717548912'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`auth\` (\`id\` int NOT NULL AUTO_INCREMENT, \`email\` varchar(255) NOT NULL, \`token\` varchar(255) NOT NULL, \`tokenFor\` varchar(255) NOT NULL DEFAULT 0, \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_b54f616411ef3824f6a5c06ea4\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`username\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`emailVerified\` tinyint NOT NULL DEFAULT 0, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`progress_trackers\` (\`id\` int NOT NULL AUTO_INCREMENT, \`totalPoints\` int NOT NULL, \`completionPercentage\` decimal(10,2) NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`userId\` int NULL, INDEX \`IDX_9f2d8d1e60d63f2db84c963280\` (\`id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`tasks\` (\`id\` int NOT NULL AUTO_INCREMENT, \`taskName\` varchar(255) NOT NULL, \`points\` int NOT NULL, \`dateCreated\` datetime NULL, \`dateUpdated\` datetime NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`userId\` int NULL, INDEX \`IDX_8d12ff38fcc62aaba2cab74877\` (\`id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`points_tables\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`taskId\` int NULL, \`userId\` int NULL, INDEX \`IDX_d322620af8b63c472aa1f8164a\` (\`id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`daily_to_do_lists\` (\`id\` int NOT NULL AUTO_INCREMENT, \`status\` varchar(255) NOT NULL, \`completionDate\` date NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`taskId\` int NULL, \`userId\` int NULL, INDEX \`IDX_e279d6f35afc08884305f3e71b\` (\`id\`), INDEX \`IDX_05c320f9f810e09322aa733668\` (\`status\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`progress_trackers\` ADD CONSTRAINT \`FK_d076380e416f7426e4d247af08f\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`tasks\` ADD CONSTRAINT \`FK_166bd96559cb38595d392f75a35\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`points_tables\` ADD CONSTRAINT \`FK_286f848eeed1fb4763b3284300f\` FOREIGN KEY (\`taskId\`) REFERENCES \`tasks\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`points_tables\` ADD CONSTRAINT \`FK_86eaf9b2be650d9b8548116d190\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`daily_to_do_lists\` ADD CONSTRAINT \`FK_b8582824a9d5a14428b63f48fec\` FOREIGN KEY (\`taskId\`) REFERENCES \`tasks\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`daily_to_do_lists\` ADD CONSTRAINT \`FK_1f8504e1862f6225eebb19ce97f\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`daily_to_do_lists\` DROP FOREIGN KEY \`FK_1f8504e1862f6225eebb19ce97f\``);
        await queryRunner.query(`ALTER TABLE \`daily_to_do_lists\` DROP FOREIGN KEY \`FK_b8582824a9d5a14428b63f48fec\``);
        await queryRunner.query(`ALTER TABLE \`points_tables\` DROP FOREIGN KEY \`FK_86eaf9b2be650d9b8548116d190\``);
        await queryRunner.query(`ALTER TABLE \`points_tables\` DROP FOREIGN KEY \`FK_286f848eeed1fb4763b3284300f\``);
        await queryRunner.query(`ALTER TABLE \`tasks\` DROP FOREIGN KEY \`FK_166bd96559cb38595d392f75a35\``);
        await queryRunner.query(`ALTER TABLE \`progress_trackers\` DROP FOREIGN KEY \`FK_d076380e416f7426e4d247af08f\``);
        await queryRunner.query(`DROP INDEX \`IDX_05c320f9f810e09322aa733668\` ON \`daily_to_do_lists\``);
        await queryRunner.query(`DROP INDEX \`IDX_e279d6f35afc08884305f3e71b\` ON \`daily_to_do_lists\``);
        await queryRunner.query(`DROP TABLE \`daily_to_do_lists\``);
        await queryRunner.query(`DROP INDEX \`IDX_d322620af8b63c472aa1f8164a\` ON \`points_tables\``);
        await queryRunner.query(`DROP TABLE \`points_tables\``);
        await queryRunner.query(`DROP INDEX \`IDX_8d12ff38fcc62aaba2cab74877\` ON \`tasks\``);
        await queryRunner.query(`DROP TABLE \`tasks\``);
        await queryRunner.query(`DROP INDEX \`IDX_9f2d8d1e60d63f2db84c963280\` ON \`progress_trackers\``);
        await queryRunner.query(`DROP TABLE \`progress_trackers\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_b54f616411ef3824f6a5c06ea4\` ON \`auth\``);
        await queryRunner.query(`DROP TABLE \`auth\``);
    }

}
