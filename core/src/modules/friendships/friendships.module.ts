import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NotificationsModule } from "@modules/notifications/notifications.module";
import { UserRepository } from "@modules/users/user.repository";
import { FriendshipRepository } from "./friendship.repository";
import { FriendshipsController } from "./friendships.controller";
import { FriendshipsService } from "./friendships.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([FriendshipRepository, UserRepository]),
    NotificationsModule
  ],
  controllers: [FriendshipsController],
  providers: [FriendshipsService],
  exports: [FriendshipsService]
})
export class FriendshipsModule {}
