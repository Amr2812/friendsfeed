import { CommentRepository } from "@modules/comments/comments.repository";
import { CommentsService } from "@modules/comments/comments.service";
import { LikeRepository } from "@modules/likes/likes.repository";
import { LikesService } from "@modules/likes/likes.service";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PostsController } from "./posts.controller";
import { PostRepository } from "./posts.repository";
import { PostsService } from "./posts.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PostRepository,
      CommentRepository,
      LikeRepository
    ])
  ],
  controllers: [PostsController],
  providers: [PostsService, CommentsService, LikesService]
})
export class PostsModule {}
