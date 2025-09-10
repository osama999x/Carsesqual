import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCoins1752472143618 implements MigrationInterface {
  name = 'CreateCoins1752472143618';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "Coins" ("id" character varying NOT NULL, "coin_gecko_id" character varying NOT NULL DEFAULT '', "tatum_id" character varying DEFAULT '', "changenow_id" character varying DEFAULT '', "changenow_network_id" character varying DEFAULT '', "simpleswap_id" character varying DEFAULT '', "name" character varying NOT NULL DEFAULT '', "symbol" character varying NOT NULL DEFAULT '', "name_short" character varying NOT NULL DEFAULT '', "symbol_short" character varying NOT NULL DEFAULT '', "binance_name" character varying NOT NULL DEFAULT '', "okx_ccy" character varying NOT NULL DEFAULT '', "okx_chain" character varying NOT NULL DEFAULT '', "logo_url" character varying DEFAULT '', "logo_url_parent" character varying DEFAULT '', "address_regex" character varying DEFAULT '', "contract_address" character varying DEFAULT '', "network_id" character varying NOT NULL DEFAULT '', "parent_id" character varying DEFAULT '', "price" double precision DEFAULT '0', "price_change" double precision DEFAULT '0', "processingFee" double precision DEFAULT '0', "processingFeeOrder" double precision DEFAULT '0', "precision_deposit" integer DEFAULT '2', "precision_withdraw" integer DEFAULT '2', "is_p2p_allowed" boolean DEFAULT false, "total_swaps" integer DEFAULT '0', "total_swaps_buy" integer DEFAULT '0', "total_swaps_sell" integer DEFAULT '0', "total_trades" integer DEFAULT '0', "priority" integer DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "is_token" boolean NOT NULL DEFAULT false, "is_mainnet" boolean NOT NULL DEFAULT true, "is_parent" boolean NOT NULL DEFAULT false, "is_deleted" boolean NOT NULL DEFAULT false, "decimal" integer NOT NULL DEFAULT '18', "p2p_withdraw_fee_fixed" double precision NOT NULL DEFAULT '0', "trading_withdraw_fee_fixed" double precision NOT NULL DEFAULT '0', "trading_withdraw_fee_exchange" double precision NOT NULL DEFAULT '0', "trading_withdraw_minimum" double precision NOT NULL DEFAULT '0', "staking_withdraw_minimum" double precision DEFAULT '0', CONSTRAINT "PK_bcf2cce81a38d0d0773c0e70491" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE INDEX "idx_coin_name" ON "Coins" ("name") `);
    await queryRunner.query(`CREATE INDEX "idx_coin_symbol" ON "Coins" ("symbol") `);
    await queryRunner.query(`CREATE INDEX "idx_coin_parent_active" ON "Coins" ("parent_id") `);
    await queryRunner.query(`CREATE INDEX "idx_coin_deleted" ON "Coins" ("is_deleted") `);
    await queryRunner.query(
      `CREATE INDEX "idx_coin_network_id_p2p_allowed" ON "Coins" ("network_id", "is_p2p_allowed") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."idx_coin_network_id_p2p_allowed"`);
    await queryRunner.query(`DROP INDEX "public"."idx_coin_deleted"`);
    await queryRunner.query(`DROP INDEX "public"."idx_coin_parent_active"`);
    await queryRunner.query(`DROP INDEX "public"."idx_coin_symbol"`);
    await queryRunner.query(`DROP INDEX "public"."idx_coin_name"`);
    await queryRunner.query(`DROP TABLE "Coins"`);
  }
}
