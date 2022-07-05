require("dotenv").config();
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

const config: PostgresConnectionOptions = {
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ["dist/src/**/*.entity{.ts,.js}"],
  migrations: ["dist/src/database/migrations/*{.ts,.js}"],
  cli: {
    migrationsDir: "src/database/migrations"
  },
  ssl:
    process.env.NODE_ENV === "development"
      ? undefined
      : {
          rejectUnauthorized: false
        },
  synchronize: process.env.NODE_ENV === "development",
  logging: process.env.NODE_ENV === "development"
};

export default config;
