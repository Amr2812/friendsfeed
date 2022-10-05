import { registerAs } from "@nestjs/config";

export const rabbitmqConfig = registerAs("rabbitmq", () => ({
  uri: process.env.RMQ_URI,
  feedService: {
    queue: process.env.FEED_RMQ_QUEUE || "feed"
  },
  friendshipService: {
    queue: process.env.FRIENDSHIP_RMQ_QUEUE || "friendships"
  }
}));
