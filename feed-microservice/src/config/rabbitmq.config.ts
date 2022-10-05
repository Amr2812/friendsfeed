import { registerAs } from "@nestjs/config";

export const rabbitmqConfig = registerAs("rabbitmq", () => ({
  uri: process.env.RABBITMQ_URI,
  queue: "feed",
  friendshipsService: {
    queue: process.env.FRIENDSHIPS_QUEUE || "friendships"
  }
}));
