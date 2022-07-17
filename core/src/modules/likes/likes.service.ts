import { Injectable } from "@nestjs/common";
import { GetPostLikesDto } from "@modules/posts/dto";
import { PostData } from "@modules/posts/types";
import { LikeRepository } from "./likes.repository";

@Injectable()
export class LikesService {
  constructor(private readonly likesRepository: LikeRepository) {}

  likePost(postId: number, userId: number) {
    return this.likesRepository.createLike(postId, userId);
  }

  getPostLikes(postId: number, filter: GetPostLikesDto) {
    return this.likesRepository.findPostLikes(postId, filter);
  }

  unlikePost(postId: number, likeId: number, userId: number) {
    return this.likesRepository.deleteLike(postId, likeId, userId);
  }

  checkIfUserLikedPosts(posts: PostData[], userId: number) {
    return this.likesRepository.checkIfUserLikedPosts(posts, userId);
  }
}
