import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateFuturePairs1752471288335 implements MigrationInterface {
    name = 'CreateFuturePairs1752471288335'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "FuturePairs" ("id" character varying NOT NULL, "pair" character varying, "base_coin_id" character varying NOT NULL, "quote_coin_id" character varying NOT NULL, "margin_coin_id" character varying, "filter_binance" json DEFAULT '[]', "future_rate_binance" double precision DEFAULT '0', "future_rate_binance_change" double precision DEFAULT '0', "last_price" double precision DEFAULT '0', "maker_fee" double precision DEFAULT '0', "taker_fee" double precision DEFAULT '0', "minimum_amount" double precision NOT NULL DEFAULT '0', "maintenance_margin_rate" double precision DEFAULT '0', "liquidation_fee_rate" double precision DEFAULT '0', "funding_rate" numeric(20,8) NOT NULL DEFAULT '0.0001', "next_funding_time" character varying, "max_leverage" double precision DEFAULT '0', "min_leverage" double precision DEFAULT '0', "max_position_size" double precision DEFAULT '0', "min_position_size" double precision DEFAULT '0', "required_margin_percent" double precision, "price_precision" integer, "quantity_precision" integer, "base_asset_precision" integer, "quote_precision" integer, "trigger_protect" double precision, "market_take_bound" double precision, "max_move_order_limit" integer, "is_active" boolean NOT NULL DEFAULT true, "is_deleted" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_24cb0391fb6251cc09e207c1ab3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "idx_future_pair_coins" ON "FuturePairs" ("base_coin_id") `);
        await queryRunner.query(`CREATE INDEX "idx_future_pair_rate" ON "FuturePairs" ("future_rate_binance") `);
        await queryRunner.query(`CREATE INDEX "idx_future_pair_active" ON "FuturePairs" ("is_active") `);
        await queryRunner.query(`CREATE INDEX "idx_future_pair_deleted" ON "FuturePairs" ("is_deleted") `);
        await queryRunner.query(`CREATE INDEX "idx_future_pair_active_deleted" ON "FuturePairs" ("is_active", "is_deleted") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."idx_future_pair_active_deleted"`);
        await queryRunner.query(`DROP INDEX "public"."idx_future_pair_deleted"`);
        await queryRunner.query(`DROP INDEX "public"."idx_future_pair_active"`);
        await queryRunner.query(`DROP INDEX "public"."idx_future_pair_rate"`);
        await queryRunner.query(`DROP INDEX "public"."idx_future_pair_coins"`);
        await queryRunner.query(`DROP TABLE "FuturePairs"`);
    }

}
