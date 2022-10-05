import { Module } from "@nestjs/common";
import { RedisProvider } from "src/common/providers";
import { FriendshipsModule } from "src/friendships/friendships.module";
import { FriendshipsService } from "src/friendships/friendships.service";
import { FeedController } from "./feed.controller";
import { FeedRepository } from "./feed.repository";
import { FeedService } from "./feed.service";

@Module({
  imports: [FriendshipsModule],
  controllers: [FeedController],
  providers: [
    FeedService,
    RedisProvider,
    FeedRepository,
    FriendshipsService
  ]
})
export class FeedModule {}
