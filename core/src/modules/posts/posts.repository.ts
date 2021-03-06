import { NotFoundException } from "@nestjs/common";
import { EntityRepository, Repository } from "typeorm";
import { UserSafeData } from "@modules/users/types";
import { Post } from "./Post.entity";
import { GetUserPostsDto } from "../users/dto";
import { PostData } from "./types";

@EntityRepository(Post)
export class PostRepository extends Repository<Post> {
  async createPost(userId: number, post: Partial<PostData>) {
    const createdPost = await this.save({ ...post, user: { id: userId } });
    return this.findPostById(createdPost.id, userId);
  }

  findPostById(postId: number, userId: number): Promise<PostData> {
    const qb = this.createQueryBuilder("post").leftJoinAndSelect(
      "post.user",
      "user"
    );

    if (userId) {
      qb.leftJoinAndSelect("post.likes", "like", "like.userId = :userId", {
        userId
      }).select(["like.id"]);
    }

    return qb
      .loadRelationCountAndMap("post.likesCount", "post.likes")
      .loadRelationCountAndMap("post.commentsCount", "post.comments")
      .addSelect([
        "post.id",
        "post.text",
        "post.createdAt",
        "user.id",
        "user.name",
        "user.picture"
      ])
      .where("post.id = :postId", { postId })
      .getOne();
  }

  async findPostAuthor(
    postId: number
  ): Promise<{ id: number; user: { id: number; fcmTokens: string[] } }> {
    const post = await this.createQueryBuilder("post")
      .leftJoinAndSelect("post.user", "user")
      .select(["post.id", "user.id", "user.fcmTokens"])
      .where("post.id = :postId", { postId })
      .getOne();

    if (!post) throw new NotFoundException("Post not found");

    return post;
  }

  async findUserPosts(userId: number, filter: GetUserPostsDto) {
    const qb = this.createQueryBuilder("post")
      .leftJoinAndSelect("post.user", "user")
      .loadRelationCountAndMap("post.likesCount", "post.likes")
      .loadRelationCountAndMap("post.commentsCount", "post.comments")
      .select([
        "post.id",
        "post.text",
        "post.createdAt",
        "user.id",
        "user.name",
        "user.picture"
      ])
      .where("user.id = :userId", { userId });

    if (filter.search) {
      qb.andWhere("post.text ILIKE :search", {
        search: `%${filter.search}%`
      });
    }

    const page = filter.page || 1;
    const limit = filter.limit || 10;
    qb.skip((page - 1) * limit).take(limit);

    const [posts, count] = await qb.getManyAndCount();

    return {
      posts: posts as PostData[],
      count,
      page,
      limit
    };
  }

  findPostsByIds(postsIds: number[]): Promise<PostData[]> {
    return this.createQueryBuilder("post")
      .leftJoinAndSelect("post.user", "user")
      .loadRelationCountAndMap("post.likesCount", "post.likes")
      .loadRelationCountAndMap("post.commentsCount", "post.comments")
      .select([
        "post.id",
        "post.text",
        "post.createdAt",
        "user.id",
        "user.name",
        "user.picture"
      ])
      .where("post.id IN (:...postsIds)", { postsIds })
      .getMany();
  }

  async updatePost(postId: number, userId: number, post: Partial<PostData>) {
    const { affected } = await this.update(
      {
        id: postId,
        user: { id: userId }
      },
      post
    );

    if (affected === 0) throw new NotFoundException("Post not found");

    return this.findPostById(postId, userId);
  }

  async deletePost(postId: number, userId: number) {
    const { affected } = await this.delete({
      id: postId,
      user: { id: userId }
    });

    if (affected === 0) throw new NotFoundException("Post not found");

    return true;
  }
}
