import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NotificationsModule } from "@modules/notifications/notifications.module";
import { PostRepository } from "@modules/posts/posts.repository";
import { CommentRepository } from "./comments.repository";
import { CommentsService } from "./comments.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([CommentRepository, PostRepository]),
    NotificationsModule
  ],
  providers: [CommentsService]
})
export class CommentsModule {}
