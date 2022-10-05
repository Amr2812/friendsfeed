import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ClientProxyFactory, Transport } from "@nestjs/microservices";
import { FriendshipsService } from "./friendships.service";

@Module({
  providers: [
    {
      provide: "FRIENDSHIPS_SERVICE",
      useFactory: (configService: ConfigService) => {
        const config = configService.get("rabbitmq");
        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [config.uri],
            queue: config.friendshipsService.queue,
            queueOptions: { durable: true },
            noAck: false
          }
        });
      },
      inject: [ConfigService]
    },
    FriendshipsService
  ],
  exports: ["FRIENDSHIPS_SERVICE", FriendshipsService]
})
export class FriendshipsModule {}
