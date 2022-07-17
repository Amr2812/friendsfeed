import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CommentRepository } from "./comments.repository";
import { CommentsService } from "./comments.service";

@Module({
  imports: [TypeOrmModule.forFeature([CommentRepository])],
  providers: [CommentsService]
})
export class CommentsModule {}
