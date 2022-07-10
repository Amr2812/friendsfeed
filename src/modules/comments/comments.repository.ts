import { GetPostCommentsDto } from "@modules/posts/dto";
import { NotFoundException } from "@nestjs/common";
import { EntityRepository, Repository } from "typeorm";
import { Comment } from "./Comment.entity";
import { CommentData } from "./types";

@EntityRepository(Comment)
export class CommentRepository extends Repository<Comment> {
  async createComment(
    userId: number,
    postId: number,
    comment: Partial<CommentData>
  ) {
    const createdComment = await this.save({
      ...comment,
      user: { id: userId },
      post: { id: postId }
    });

    return this.findCommentById(createdComment.id);
  }

  async findPostComments(postId: number, filter: GetPostCommentsDto) {
    const qb = this.createQueryBuilder("comment")
      .leftJoinAndSelect("comment.user", "user")
      .select([
        "comment.id",
        "comment.text",
        "comment.createdAt",
        "comment.postId",
        "user.id",
        "user.name",
        "user.picture"
      ])
      .where("comment.postId = :postId", { postId });

    const page = filter.page || 1;
    const limit = filter.limit || 20;
    qb.skip((page - 1) * limit).take(limit);

    const [comments, count] = await qb.getManyAndCount();

    return {
      comments: comments as CommentData[],
      count,
      page,
      limit
    };
  }

  findCommentById(commentId: number): Promise<CommentData> {
    return this.createQueryBuilder("comment")
      .leftJoinAndSelect("comment.user", "user")
      .select([
        "comment.id",
        "comment.text",
        "comment.createdAt",
        "comment.postId",
        "user.id",
        "user.name",
        "user.picture"
      ])
      .where("comment.id = :commentId", { commentId })
      .getOne();
  }

  async updateComment(
    commentId: number,
    userId: number,
    postId: number,
    comment: Partial<CommentData>
  ) {
    const { affected } = await this.update(
      {
        id: commentId,
        post: { id: postId },
        user: { id: userId }
      },
      comment
    );

    if (affected === 0) throw new NotFoundException("Comment not found");

    return this.findCommentById(commentId);
  }

  async deleteComment(commentId: number, postId: number, userId: number) {
    const { affected } = await this.delete({
      id: commentId,
      post: { id: postId },
      user: { id: userId }
    });

    if (affected === 0) throw new NotFoundException("Comment not found");
    return true;
  }
}
