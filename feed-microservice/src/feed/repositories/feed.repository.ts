import { Injectable } from "@nestjs/common";
import Redis from "ioredis";
import { RedisProvider } from "src/common/providers";
import { GetUserFeedResDto } from "../dto";

@Injectable()
export class FeedRepository {
  private readonly redis: Redis;

  constructor(private readonly redisProvider: RedisProvider) {
    this.redis = this.redisProvider.getRedis();
  }

  prependPostToUsersFeeds(postId: number, userId: number) {
    return this.redis.lpush(`user:${userId}:feed`, postId);
  }

  async findUserFeedIds(
    userId: number,
    limit: number
  ): Promise<GetUserFeedResDto> {
    limit = limit || 10;
    const feedIds = await this.redis.lrange(`user:${userId}:feed`, 0, limit);

    if (feedIds.length > 0) {
      await this.redis.ltrim(`user:${userId}:feed`, 1, limit);
    }

    return {
      userId: userId,
      posts: feedIds.map(id => parseInt(id))
    };
  }
}
