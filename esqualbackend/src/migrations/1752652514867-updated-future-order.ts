import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdatedFutureOrder1752652514867 implements MigrationInterface {
  name = 'UpdatedFutureOrder1752652514867';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "FutureOrders" ADD "execution_price" numeric`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "FutureOrders" DROP COLUMN "execution_price"`);
  }
}
