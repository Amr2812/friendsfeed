import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ClientProxyFactory, Transport } from "@nestjs/microservices";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FriendshipsModule } from "@modules/friendships/friendships.module";
import { PostRepository } from "@modules/posts/posts.repository";
import { LikeRepository } from "@modules/likes/likes.repository";
import { FeedRepository } from "./feed.repository";
import { FeedController } from "./feed.controller";
import { FeedService } from "./feed.service";

@Module({
  imports: [TypeOrmModule.forFeature([FeedRepository, PostRepository, LikeRepository]), FriendshipsModule],
  controllers: [FeedController],
  providers: [
    {
      provide: "FEED_WORKER",
      useFactory: (configService: ConfigService) => {
        const config = configService.get("rabbitmq");
        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [config.uri],
            queue: config.feedService.queue,
            queueOptions: { durable: true },
            noAck: false
          }
        });
      },
      inject: [ConfigService]
    },
    FeedService
  ],
  exports: ["FEED_WORKER", FeedService]
})
export class FeedModule {}
