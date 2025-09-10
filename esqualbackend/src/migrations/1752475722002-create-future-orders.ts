import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateFuturePairsFundingRate1752475722002 implements MigrationInterface {
  name = 'UpdateFuturePairsFundingRate1752475722002';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "FuturePairs" ALTER COLUMN "funding_rate" SET DEFAULT '0.0001'`,
    );
    await queryRunner.query(
      `ALTER TABLE "FuturePairs" ALTER COLUMN "funding_rate" SET DEFAULT '0.0001'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "FuturePairs" ALTER COLUMN "funding_rate" SET DEFAULT 0.0001`,
    );
    await queryRunner.query(
      `ALTER TABLE "FuturePairs" ALTER COLUMN "funding_rate" SET DEFAULT 0.0001`,
    );
  }
}
