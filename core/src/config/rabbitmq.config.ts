import { registerAs } from "@nestjs/config";

export const rabbitmqConfig = registerAs("rabbitmq", () => ({
  feedService: {
    uri: process.env.FEED_RMQ_URI,
    queue: process.env.FEED_RMQ_QUEUE || "feed"
  }
}));
