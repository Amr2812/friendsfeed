import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NotificationsModule } from "@modules/notifications/notifications.module";
import { PostRepository } from "@modules/posts/posts.repository";
import { LikeRepository } from "./likes.repository";
import { LikesService } from "./likes.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([LikeRepository, PostRepository]),
    NotificationsModule
  ],
  providers: [LikesService],
  exports: [LikesService]
})
export class LikesModule {}
