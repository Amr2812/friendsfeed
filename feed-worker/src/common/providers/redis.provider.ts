import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Redis from "ioredis";

@Injectable()
export class RedisProvider {
  private logger = new Logger("RedisProvider");
  private redis: Redis;

  constructor(
    private readonly config: ConfigService
  ) {
    this.redis = new Redis({
      host: this.config.get("redis.host"),
      port: this.config.get("redis.port"),
      password: this.config.get("redis.password")
    });

    this.redis.on("error", err => {
      this.logger.error(err);
    });

    this.redis.on("ready", () => {
      this.logger.log("Redis is ready");
    });
  }

  getRedis(): Redis {
    return this.redis;
  }
}
