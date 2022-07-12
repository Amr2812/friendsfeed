import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { LikesService } from "@modules/likes/likes.service";
import { GetUserPostsDto } from "../users/dto";
import { PostRepository } from "./posts.repository";
import { PostData } from "./types";

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostRepository)
    private readonly postRepository: PostRepository,
    private readonly likesService: LikesService
  ) {}

  createPost(userId: number, post: Partial<PostData>) {
    return this.postRepository.createPost(userId, post);
  }

  async getPost(postId: number, userId: number) {
    const post = await this.postRepository.findPostById(postId, userId);
    if (!post) throw new NotFoundException("Post not found");

    if (userId) {
      post.likeId = post.likes[0]?.id;
      post.likes = undefined;
    }

    return post;
  }

  async getUserPosts(
    userId: number,
    filter: GetUserPostsDto,
    currentUserId: number
  ) {
    const records = await this.postRepository.findUserPosts(userId, filter);

    if (currentUserId) {
      records.posts = await this.likesService.checkIfUserLikedPosts(
        records.posts,
        currentUserId
      );
    }

    return records;
  }

  updatePost(postId: number, userId: number, post: Partial<PostData>) {
    return this.postRepository.updatePost(postId, userId, post);
  }

  deletePost(postId: number, userId: number) {
    return this.postRepository.deletePost(postId, userId);
  }
}
