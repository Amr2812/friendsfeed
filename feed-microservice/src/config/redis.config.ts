import { registerAs } from "@nestjs/config";

export const redisConfig = registerAs("redis", () => ({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD
}));
