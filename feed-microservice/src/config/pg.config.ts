import { registerAs } from "@nestjs/config";
import { ClientConfig } from "pg";

export const pgConfig = registerAs(
  "pg",
  (): ClientConfig => ({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  })
);
