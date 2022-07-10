import { CommentRepository } from "@modules/comments/comments.repository";
import { CommentsService } from "@modules/comments/comments.service";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PostsController } from "./posts.controller";
import { PostRepository } from "./posts.repository";
import { PostsService } from "./posts.service";

@Module({
  imports: [TypeOrmModule.forFeature([PostRepository, CommentRepository])],
  controllers: [PostsController],
  providers: [PostsService, CommentsService]
})
export class PostsModule {}
