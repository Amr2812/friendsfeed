import { NotFoundException } from "@nestjs/common";
import { EntityRepository, Repository } from "typeorm";
import { Post } from "./Post.entity";
import { GetUserPostsDto } from "../users/dto";
import { PostData } from "./types";

@EntityRepository(Post)
export class PostRepository extends Repository<Post> {
  async createPost(userId: number, post: Partial<PostData>) {
    const createdPost = await this.save({ ...post, user: { id: userId } });
    return this.findPostById(createdPost.id, userId);
  }

  async findPostById(postId: number, userId: number): Promise<PostData> {
    const qb = this.createQueryBuilder("post").leftJoinAndSelect(
      "post.user",
      "user"
    );

    if (userId) {
      qb.leftJoinAndSelect("post.likes", "like", "like.userId = :userId", {
        userId
      }).select(["like.id"]);
    }

    const rawPost = await qb
      .addSelect([
        "post.id",
        "post.text",
        "post.createdAt",
        "user.id",
        "user.name",
        "user.picture"
      ])
      .addSelect(subQuery =>
        subQuery
          .select("COUNT(*)", "comments_count")
          .from("comments", "c")
          .where("c.postId = post.id")
      )
      .addSelect(subQuery =>
        subQuery
          .select("COUNT(*)", "likes_count")
          .from("posts_likes", "l")
          .where("l.postId = post.id")
      )
      .where("post.id = :postId", { postId })
      .getRawOne();
      
    const post = {
      id: rawPost.post_id,
      text: rawPost.post_text,
      createdAt: rawPost.post_createdAt,
      user: {
        id: rawPost.user_id,
        name: rawPost.user_name,
        picture: rawPost.user_picture
      },
      likesCount: rawPost.likes_count,
      commentsCount: rawPost.comments_count,
      likeId: rawPost.like_id
    } as PostData;

    return post;
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
    const page = filter.page || 1;
    const limit = filter.limit || 10;

    const qb = this.createQueryBuilder("post")
      .select([
        "post.id",
        "post.text",
        "post.createdAt",
        "user.id",
        "user.name",
        "user.picture",
        "COUNT(likes.id) as likes_count",
        "COUNT(comments.id) as comments_count"
      ])
      .leftJoin("post.user", "user")
      .leftJoin("post.likes", "likes")
      .leftJoin("post.comments", "comments")
      .where("user.id = :userId", { userId })
      .groupBy("post.id, user.id")
      .orderBy("post.createdAt", "DESC")
      .limit(limit)
      .offset((page - 1) * limit);

    if (filter.search) {
      qb.andWhere("post.text ILIKE :text", { text: `%${filter.search}%` });
    }

    const [rawPosts, count] = await Promise.all([
      qb.getRawMany(),
      this.count({
        user: {
          id: userId
        }
      })
    ]);

    const posts = rawPosts.map(rawPost => ({
      id: rawPost.post_id,
      text: rawPost.post_text,
      createdAt: rawPost.post_createdAt,
      user: {
        id: rawPost.user_id,
        name: rawPost.user_name,
        picture: rawPost.user_picture
      },
      likesCount: rawPost.likes_count,
      commentsCount: rawPost.comments_count
    })) as PostData[];

    return {
      posts,
      count,
      page,
      limit
    };
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
