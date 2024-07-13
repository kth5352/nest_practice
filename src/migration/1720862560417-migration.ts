import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1720862560417 implements MigrationInterface {
    name = 'Migration1720862560417'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`username\` varchar(20) NOT NULL, \`name\` varchar(10) NOT NULL, \`password\` varchar(100) NOT NULL, \`email\` varchar(50) NOT NULL, \`birth\` date NULL, UNIQUE INDEX \`IDX_78a916df40e02a9deb1c4b75ed\` (\`username\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_78a916df40e02a9deb1c4b75ed\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
    }

}
