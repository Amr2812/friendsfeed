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
    const page = filter.page || 1;
    const limit = filter.limit || 10;

    const query = `
      SELECT
        post.id,
        post.text,
        post."createdAt",
        "user".id AS "userId",
        "user".name AS "userName",
        "user".picture AS "userPicture",
        (SELECT COUNT(*) AS "likesCount" FROM "posts_likes" WHERE posts_likes."postId" = post.id),
        (SELECT COUNT(*) AS "commentsCount" FROM "comments" WHERE comments."postId" = post.id)
      FROM posts post
      LEFT JOIN "users" "user" ON "user".id = post."userId"
      WHERE "user".id = $1
      GROUP BY post.id, "user".id
      ORDER BY post."createdAt" DESC
      LIMIT $2 OFFSET $3;
    `;

    const queryWithSearch = `
      SELECT
        post.id,
        post.text,
        post."createdAt",
        "user".id AS "userId",
        "user".name AS "userName",
        "user".picture AS "userPicture",
        (SELECT COUNT(*) AS "likesCount" FROM "posts_likes" WHERE posts_likes."postId" = post.id),
        (SELECT COUNT(*) AS "commentsCount" FROM "comments" WHERE comments."postId" = post.id)
      FROM posts post
      LEFT JOIN "users" "user" ON "user".id = post."userId"
      WHERE "user".id = $1 AND post.text ILIKE $4
      GROUP BY post.id, "user".id
      ORDER BY post."createdAt" DESC
      LIMIT $2 OFFSET $3;
    `;

    const [rawPosts, count] = await Promise.all([
      filter.search
        ? this.query(queryWithSearch, [
            userId,
            limit,
            (page - 1) * limit,
            `%${filter.search}%`
          ])
        : this.query(query, [userId, limit, (page - 1) * limit]),
      this.count({
        user: {
          id: userId
        }
      })
    ]);

    const posts: PostData[] = rawPosts.map((post: any) => ({
      id: post.id,
      text: post.text,
      createdAt: post.createdAt,
      user: {
        id: post.userId,
        name: post.userName,
        picture: post.userPicture
      },
      likesCount: parseInt(post.likesCount),
      commentsCount: parseInt(post.commentsCount)
    }));

    return {
      posts,
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
