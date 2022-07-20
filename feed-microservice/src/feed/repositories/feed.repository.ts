import { Injectable } from "@nestjs/common";
import Redis from "ioredis";
import { RedisProvider } from "src/common/providers";

@Injectable()
export class FeedRepository {
  private readonly redis: Redis;

  constructor(private readonly redisProvider: RedisProvider) {
    this.redis = this.redisProvider.getRedis();
  }

  prependPostToUsersFeeds(postId: number, userId: number) {
    return this.redis.lpush(`user:${userId}:feed`, postId);
  }
}
