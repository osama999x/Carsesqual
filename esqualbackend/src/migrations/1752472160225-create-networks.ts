import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateNetworks1752472160225 implements MigrationInterface {
  name = 'CreateNetworks1752472160225';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "Networks" ("id" character varying NOT NULL, "name" character varying NOT NULL DEFAULT '', "symbol" character varying NOT NULL DEFAULT '', "binance_name" character varying NOT NULL DEFAULT '', "logo_url" character varying NOT NULL DEFAULT '', "rpc_url" character varying NOT NULL DEFAULT '', "network_type" character varying NOT NULL DEFAULT '', "wallet_type" character varying DEFAULT '', "chain_id" integer, "chain_id_hex" character varying NOT NULL DEFAULT '', "is_active" boolean DEFAULT true, "tatum_network_id" character varying DEFAULT '', "tatum_network_name" character varying DEFAULT '', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "is_mainnet" boolean NOT NULL DEFAULT true, "is_deleted" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_fb9bed287569c1ef22bdd89a98f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE INDEX "idx_network_name" ON "Networks" ("name") `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."idx_network_name"`);
    await queryRunner.query(`DROP TABLE "Networks"`);
  }
}
