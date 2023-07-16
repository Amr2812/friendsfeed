import {
  EntityRepository,
  Repository,
  getManager,
  EntityManager
} from "typeorm";
import { PostData } from "@modules/posts/types";
import { FeedPost } from "./FeedPost.entity";

@EntityRepository(FeedPost)
export class FeedRepository extends Repository<FeedPost> {
  async findThenDeleteFeed(userId: number, limit: number) {
    let posts = await getManager().transaction(
      async (transactionalEntityManager: EntityManager) => {
        const posts = await transactionalEntityManager
          .createQueryBuilder()
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
          .from(FeedPost, "feed_post")
          .leftJoin("feed_post.user", "user")
          .leftJoin("feed_post.post", "post")
          .leftJoin("post.comments", "comments")
          .leftJoin("post.likes", "likes")
          .where("feed_post.userId = :userId", { userId })
          .orderBy("feed_post.createdAt", "DESC")
          .groupBy("post.id, user.id, feed_post.createdAt")
          .limit(limit)
          .getRawMany();

        await transactionalEntityManager
          .createQueryBuilder()
          .delete()
          .from(FeedPost)
          .where("userId = :userId", { userId })
          .andWhere("postId IN (:...postsIds)", {
            postsIds: posts.map(post => post.post_id)
          })
          .execute();

        return posts;
      }
    );

    posts = posts.map(post => ({
      id: post.post_id,
      text: post.post_text,
      createdAt: post.createdAt,
      user: {
        id: post.user_id,
        name: post.user_name,
        picture: post.user_picture
      },
      likesCount: post.likes_count,
      commentsCount: post.comments_count
    })) as PostData[];

    return { posts };
  }
}
