import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PostRepository } from "@modules/posts/posts.repository";
import { NotificationsService } from "@modules/notifications/notifications.service";
import { GetPostLikesDto } from "@modules/posts/dto";
import { NotificationType } from "@modules/notifications/NotificationType.enum";
import { PostData } from "@modules/posts/types";
import { LikeRepository } from "./likes.repository";

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(LikeRepository)
    private readonly likesRepository: LikeRepository,
    @InjectRepository(PostRepository)
    private readonly postsRepository: PostRepository,
    private readonly notificationsService: NotificationsService
  ) {}

  async likePost(postId: number, userId: number) {
    await this.likesRepository.createLike(postId, userId);

    const postAuthor = await this.postsRepository.findPostAuthor(postId);

    if (postAuthor.user.id !== userId) {
      this.notificationsService.send(
        postAuthor.user.fcmTokens,
        NotificationType.POST_LIKE,
        {
          userId: postAuthor.user.id,
          fromUserId: userId,
          postId
        }
      );
    }
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
