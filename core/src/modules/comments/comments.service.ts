import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { NotificationsService } from "@modules/notifications/notifications.service";
import { PostRepository } from "@modules/posts/posts.repository";
import { GetPostCommentsDto } from "@modules/posts/dto";
import { NotificationType } from "@modules/notifications/NotificationType.enum";
import { CommentRepository } from "./comments.repository";
import { CommentData } from "./types";

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentRepository)
    private readonly commentRepository: CommentRepository,
    @InjectRepository(PostRepository)
    private readonly postRepository: PostRepository,
    private readonly notificationsService: NotificationsService
  ) {}

  async createComment(
    userId: number,
    postId: number,
    comment: Partial<CommentData>
  ) {
    const createdComment = await this.commentRepository.createComment(
      userId,
      postId,
      comment
    );

    const postAuthor = await this.postRepository.findPostAuthor(postId);

    if (postAuthor.user.id !== userId) {
      this.notificationsService.send(
        postAuthor.user.fcmTokens,
        NotificationType.POST_COMMENT,
        {
          userId: postAuthor.user.id,
          fromUserId: userId,
          postId
        }
      );
    }

    return createdComment;
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

  updateComment(
    commentId: number,
    userId: number,
    postId: number,
    comment: Partial<CommentData>
  ) {
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
