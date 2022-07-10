import { NotFoundException } from "@nestjs/common";
import { EntityRepository, Repository } from "typeorm";
import { Post } from "./Post.entity";
import { GetUserPostsDto } from "../users/dto";
import { PostData } from "./types";

@EntityRepository(Post)
export class PostRepository extends Repository<Post> {
  async createPost(userId: number, post: Partial<PostData>) {
    const createdPost = await this.save({ ...post, user: { id: userId } });
    return this.findPostById(createdPost.id);
  }

  findPostById(postId: number): Promise<PostData> {
    return this.createQueryBuilder("post")
      .leftJoinAndSelect("post.user", "user")
      .select([
        "post.id",
        "post.content",
        "post.createdAt",
        "user.id",
        "user.name",
        "user.picture"
      ])
      .where("post.id = :postId", { postId })
      .getOne();
  }

  async findUserPosts(userId: number, filter: GetUserPostsDto) {
    const qb = this.createQueryBuilder("post")
      .leftJoinAndSelect("post.user", "user")
      .select([
        "post.id",
        "post.content",
        "post.createdAt",
        "user.id",
        "user.name",
        "user.picture"
      ])
      .where("user.id = :userId", { userId });

    if (filter.search) {
      qb.andWhere("post.content LIKE :search", {
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

  async updatePost(postId: number, userId: number, post: Partial<PostData>) {
    const { affected } = await this.update(
      {
        id: postId,
        user: { id: userId }
      },
      post
    );

    if (affected === 0) throw new NotFoundException("Post not found");

    return this.findPostById(postId);
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
