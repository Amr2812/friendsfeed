import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GetPostCommentsDto } from "@modules/posts/dto";
import { CommentRepository } from "./comments.repository";
import { CommentData } from "./types";

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentRepository)
    private readonly commentRepository: CommentRepository
  ) {}

  createComment(userId: number, postId: number, comment: Partial<CommentData>) {
    return this.commentRepository.createComment(userId, postId, comment);
  }

  getPostComments(postId: number, filter: GetPostCommentsDto) {
    return this.commentRepository.findPostComments(postId, filter);
  }

  async getComment(commentId: number, postId: number) {
    const comment = await this.commentRepository.findCommentById(commentId);
    if (!comment || comment.postId != postId) {
      console.log(comment);
      throw new NotFoundException("Comment not found");
    }
    return comment;
  }

  updateComment(commentId: number, userId: number, postId: number, comment: Partial<CommentData>) {
    return this.commentRepository.updateComment(
      commentId,
      postId,
      userId,
      comment
    );
  }

  deleteComment(commentId: number, postId: number, userId: number) {
    return this.commentRepository.deleteComment(commentId, postId, userId);
  }
}
