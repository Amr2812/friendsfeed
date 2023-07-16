import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { postgresConfig, rabbitmqConfig } from "./config";
import { FeedModule } from "./feed/feed.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [rabbitmqConfig, postgresConfig]
    }),
    FeedModule
  ]
})
export class AppModule {}
