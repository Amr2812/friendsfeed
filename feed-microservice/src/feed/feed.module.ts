import { Module } from "@nestjs/common";
import { RedisProvider, PGProvider } from "src/common/providers";
import { FeedController } from "./feed.controller";
import { FeedRepository, FriendsRepository } from "./repositories";
import { FeedService } from "./feed.service";
import { ConfigService } from "@nestjs/config";

@Module({
  controllers: [FeedController],
  providers: [
    FeedService,
    RedisProvider,
    {
      provide: "PG",
      useFactory: async (configService: ConfigService) => {
        const pg = new PGProvider(configService);
        await pg.init();
        return pg.getPG();
      },
      inject: [ConfigService]
    },
    FeedRepository,
    FriendsRepository
  ]
})
export class FeedModule {}
