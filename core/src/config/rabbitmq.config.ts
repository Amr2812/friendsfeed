import { registerAs } from "@nestjs/config";

export const rabbitmqConfig = registerAs("rabbitmq", () => ({
  feedService: {
    host: process.env.FEED_RMQ_HOST || "localhost",
    port: process.env.FEED_RMQ_PORT || 5672,
    user: process.env.FEED_RMQ_USER || "guest",
    password: process.env.FEED_RMQ_PASSWORD || "guest",
    queue: process.env.FEED_RMQ_QUEUE || "feed"
  }
}));
