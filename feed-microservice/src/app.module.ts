import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { rabbitmqConfig, redisConfig } from "./config";
import { FeedModule } from "./feed/feed.module";
import { FriendshipsModule } from "./friendships/friendships.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [rabbitmqConfig, redisConfig]
    }),
    FeedModule,
    FriendshipsModule
  ]
})
export class AppModule {}
