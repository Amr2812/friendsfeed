import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GetUserPostsDto } from "../users/dto";
import { PostRepository } from "./posts.repository";
import { PostData } from "./types";

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostRepository)
    private readonly postRepository: PostRepository
  ) {}

  createPost(userId: number, post: Partial<PostData>) {
    return this.postRepository.createPost(userId, post);
  }

  async getPost(postId: number) {
    const post = await this.postRepository.findPost(postId);
    if (!post) throw new NotFoundException("Post not found");
    return post;
  }

  getUserPosts(userId: number, getUserPostsDto: GetUserPostsDto) {
    return this.postRepository.findUserPosts(userId, getUserPostsDto);
  }

  updatePost(postId: number, userId: number, post: Partial<PostData>) {
    return this.postRepository.updatePost(postId, userId, post);
  }

  deletePost(postId: number, userId: number) {
    return this.postRepository.deletePost(postId, userId);
  }
}
