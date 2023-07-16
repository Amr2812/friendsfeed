import { registerAs } from "@nestjs/config";

export const postgresConfig = registerAs("postgres", () => ({
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD
}));
