import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateFuturePositions1752475722004 implements MigrationInterface {
  name = 'CreateFuturePositions1752475722004';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."FuturePositions_status_enum" AS ENUM('OPEN', 'CLOSE', 'LIQUIDATED', 'PARTIALLY_CLOSED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "FuturePositions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user-id" character varying NOT NULL, "symbol" character varying NOT NULL, "quantity" numeric(18,10) NOT NULL, "entry-price" numeric(18,10) NOT NULL, "market-price-pnl" numeric(18,10) DEFAULT '0', "margin" numeric(18,10) NOT NULL, "break-even-price" numeric(18,10) NOT NULL, "notional-size" numeric(18,10) NOT NULL, "maintenance-margin" numeric(18,10), "liquidation-price" numeric(18,10), "leverage" numeric DEFAULT '1', "margin-balance" numeric(18,10), "pnl" numeric(18,10), "roi" numeric(18,10), "margin-ratio" numeric(18,10), "status" "public"."FuturePositions_status_enum" NOT NULL DEFAULT 'OPEN', "funding-fee" numeric(20,8) NOT NULL DEFAULT '0', "tp-sl" jsonb DEFAULT '[]', "created-at" TIMESTAMP NOT NULL DEFAULT now(), "updated-at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d9e851344eee98fba8d90e30bf1" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "FuturePositions"`);
    await queryRunner.query(`DROP TYPE "public"."FuturePositions_status_enum"`);
  }
}
