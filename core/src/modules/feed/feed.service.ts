import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { InjectRepository } from "@nestjs/typeorm";
import { FriendshipsService } from "@modules/friendships/friendships.service";
import { FeedRepository } from "./feed.repository";
import { FeedEvents } from "./FeedEvents.enum";
import { PostPublished } from "./interfaces";
import { LikeRepository } from "@modules/likes/likes.repository";

@Injectable()
export class FeedService {
  constructor(
    @Inject("FEED_WORKER") private readonly feedClient: ClientProxy,
    private readonly friendshipsService: FriendshipsService,
    @InjectRepository(FeedRepository)
    private readonly feedRepository: FeedRepository,
    @InjectRepository(LikeRepository)
    private readonly likesRepository: LikeRepository
  ) {}

  async getFeed(userId: number, limit: number) {
    let { posts } = await this.feedRepository.findThenDeleteFeed(userId, limit);
    posts = await this.likesRepository.checkIfUserLikedPosts(posts, userId);

    return { posts };
  }

  async emitPostPublished(postId: number, userId: number) {
    const friendsIds = await this.friendshipsService.getFriendsIds(userId);

    if (friendsIds.length === 0) return;

    const payload: PostPublished = { postId, friendsIds };
    return this.feedClient.emit(FeedEvents.POST_PUBLISHED, payload);
  }
}
