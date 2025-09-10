import { registerAs } from "@nestjs/config";

require("dotenv").config(); // Load .env variables

export const typeOrmConfig = {
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: Number(process.env.DATABASE_PORT) || 5432,
  username: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'password123',
  database: process.env.DATABASE || 'exchange',
  entities: [__dirname + '/../../**/*.entity{.js,.ts}'], // Use __dirname for paths
  migrations: [__dirname + '/../config/../migrations/*{.js,.ts}'], // Use __dirname for paths
  migrationsRun: false,
  synchronize: false,
  logging: false,
  ...(process.env.NODE_ENV != 'LOCAL' && {
    ssl: {
      rejectUnauthorized: false,
    },
  }),
};

export default registerAs("typeorm", () => typeOrmConfig);
