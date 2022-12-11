import { ConflictException, NotFoundException } from "@nestjs/common";
import { EntityRepository, In, Repository } from "typeorm";
import { MiniUserDto } from "@common/types";
import { GetPostLikesDto } from "@modules/posts/dto";
import { PostData } from "@modules/posts/types";
import { Like } from "./Like.entity";

@EntityRepository(Like)
export class LikeRepository extends Repository<Like> {
  async createLike(postId: number, userId: number) {
    const createdLike = this.create({
      post: { id: postId },
      user: { id: userId }
    });

    try {
      await this.insert(createdLike);
    } catch (err) {
      if (err.code == "23505") {
        throw new ConflictException("You have already liked this post");
      } else if (err.code == "23503") {
        throw new NotFoundException("Post or user not found");
      }

      throw err;
    }

    return createdLike;
  }

  async findPostLikes(postId: number, filter: GetPostLikesDto) {
    const qb = this.createQueryBuilder("like")
      .leftJoinAndSelect("like.user", "user")
      .select(["like.id", "user.id", "user.name", "user.picture"])
      .where("like.postId = :postId", { postId });

    const page = filter.page || 1;
    const limit = filter.limit || 20;
    qb.skip((page - 1) * limit).take(limit);

    const [likes, count] = await qb.getManyAndCount();

    return {
      likes: likes as { user: MiniUserDto }[],
      count,
      page,
      limit
    };
  }

  async deleteLike(postId: number, likeId: number, userId: number) {
    const { affected } = await this.delete({
      id: likeId,
      post: { id: postId },
      user: { id: userId }
    });

    if (affected === 0) {
      throw new NotFoundException("You have not liked this post");
    }
    return true;
  }

  async checkIfUserLikedPosts(
    posts: PostData[],
    userId: number
  ): Promise<PostData[]> {
    const likes = await this.createQueryBuilder("like")
      .leftJoinAndSelect("like.user", "user")
      .where("like.postId IN (:...postIds)", {
        postIds: posts.map(post => post.id)
      })
      .andWhere("user.id = :userId", { userId })
      .getMany();

    // map post to likeId
    return posts.map(post => ({
      ...post,
      likeId: likes.find(like => like.postId === post.id)?.id
    }));
  }
}
