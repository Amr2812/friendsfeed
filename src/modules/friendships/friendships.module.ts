import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FriendshipRepository } from "./friendship.repository";
import { FriendshipsController } from "./friendships.controller";
import { FriendshipsService } from "./friendships.service";

@Module({
  imports: [TypeOrmModule.forFeature([FriendshipRepository])],
  controllers: [FriendshipsController],
  providers: [FriendshipsService]
})
export class FriendshipsModule {}
