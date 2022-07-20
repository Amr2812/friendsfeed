import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { rabbitmqConfig, redisConfig, pgConfig } from "./config";
import { FeedModule } from "./feed/feed.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [rabbitmqConfig, redisConfig, pgConfig]
    }),
    FeedModule
  ]
})
export class AppModule {}
