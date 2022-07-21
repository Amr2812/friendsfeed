import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ClientProxyFactory, Transport } from "@nestjs/microservices";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PostRepository } from "@modules/posts/posts.repository";
import { FeedController } from "./feed.controller";
import { FeedService } from "./feed.service";

@Module({
  imports: [TypeOrmModule.forFeature([PostRepository])],
  controllers: [FeedController],
  providers: [
    {
      provide: "FEED_SERVICE",
      useFactory: (configService: ConfigService) => {
        const config = configService.get("rabbitmq.feedService");
        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [config.uri],
            queue: config.queue,
            queueOptions: { durable: true },
            noAck: false
          }
        });
      },
      inject: [ConfigService]
    },
    FeedService
  ],
  exports: ["FEED_SERVICE", FeedService]
})
export class FeedModule {}
