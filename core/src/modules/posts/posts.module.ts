import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CommentRepository } from "@modules/comments/comments.repository";
import { CommentsService } from "@modules/comments/comments.service";
import { FeedModule } from "@modules/feed/feed.module";
import { LikeRepository } from "@modules/likes/likes.repository";
import { LikesService } from "@modules/likes/likes.service";
import { PostsController } from "./posts.controller";
import { PostRepository } from "./posts.repository";
import { PostsService } from "./posts.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PostRepository,
      CommentRepository,
      LikeRepository
    ]),
    FeedModule
  ],
  controllers: [PostsController],
  providers: [
    PostsService,
    CommentsService,
    LikesService
  ]
})
export class PostsModule {}
