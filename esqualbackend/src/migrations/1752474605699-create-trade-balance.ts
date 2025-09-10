import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTradeBalance1752474605699 implements MigrationInterface {
    name = 'CreateTradeBalance1752474605699'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "TradeBalance" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" character varying NOT NULL, "coin_id" character varying NOT NULL DEFAULT '', "balance_spot" double precision NOT NULL DEFAULT '0', "balance_future" double precision NOT NULL DEFAULT '0', "balance_spot_available" double precision NOT NULL DEFAULT '0', "balance_future_available" double precision NOT NULL DEFAULT '0', "balanceWithdrawFreeze" double precision NOT NULL DEFAULT '0', "margin_locked" double precision NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "is_deleted" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_3771d8c4a7643d0d4bb9b3ea16a" UNIQUE ("user_id", "coin_id"), CONSTRAINT "PK_5e6c0f7c5fe280618ea2d756ee6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "idx_trade_balance_user" ON "TradeBalance" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "idx_trade_balance_coin" ON "TradeBalance" ("coin_id") `);
        await queryRunner.query(`CREATE INDEX "idx_trade_balance_spot" ON "TradeBalance" ("balance_spot") `);
        await queryRunner.query(`CREATE INDEX "idx_trade_balance_created" ON "TradeBalance" ("created_at") `);
        await queryRunner.query(`CREATE INDEX "idx_trade_balance_deleted" ON "TradeBalance" ("is_deleted") `);
        await queryRunner.query(`CREATE INDEX "idx_trade_balance_user_coin_deleted" ON "TradeBalance" ("user_id", "coin_id", "is_deleted") `);
        await queryRunner.query(`ALTER TABLE "FuturePairs" ALTER COLUMN "funding_rate" SET DEFAULT '0.0001'`);
        await queryRunner.query(`ALTER TABLE "FuturePairs" ALTER COLUMN "funding_rate" SET DEFAULT '0.0001'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "FuturePairs" ALTER COLUMN "funding_rate" SET DEFAULT 0.0001`);
        await queryRunner.query(`ALTER TABLE "FuturePairs" ALTER COLUMN "funding_rate" SET DEFAULT 0.0001`);
        await queryRunner.query(`DROP INDEX "public"."idx_trade_balance_user_coin_deleted"`);
        await queryRunner.query(`DROP INDEX "public"."idx_trade_balance_deleted"`);
        await queryRunner.query(`DROP INDEX "public"."idx_trade_balance_created"`);
        await queryRunner.query(`DROP INDEX "public"."idx_trade_balance_spot"`);
        await queryRunner.query(`DROP INDEX "public"."idx_trade_balance_coin"`);
        await queryRunner.query(`DROP INDEX "public"."idx_trade_balance_user"`);
        await queryRunner.query(`DROP TABLE "TradeBalance"`);
    }

}
