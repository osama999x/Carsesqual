import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdatedFuturePositions1752648845522 implements MigrationInterface {
  name = 'UpdatedFuturePositions1752648845522';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "FuturePositions" ADD "side" character varying NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "FuturePositions" DROP COLUMN "side"`);
  }
}
