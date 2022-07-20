import { registerAs } from "@nestjs/config";

export const rabbitmqConfig = registerAs("rabbitmq", () => ({
  host: process.env.RABBITMQ_HOST,
  port: process.env.RABBITMQ_PORT,
  user: process.env.RABBITMQ_USER,
  password: process.env.RABBITMQ_PASSWORD,
  queue: "feed"
}));
