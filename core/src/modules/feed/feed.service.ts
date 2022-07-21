import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { InjectRepository } from "@nestjs/typeorm";
import { PostRepository } from "@modules/posts/posts.repository";
import { FeedEvents } from "./FeedEvents.enum";
import { GetUserFeed, GetUserFeedRes, PostPublished } from "./interfaces";

@Injectable()
export class FeedService {
  constructor(
    @Inject("FEED_SERVICE") private readonly feedClient: ClientProxy,
    @InjectRepository(PostRepository)
    private readonly postRepository: PostRepository
  ) {}

  getFeed(userId: number, limit: number) {
    const payload: GetUserFeed = { userId, limit };
    return new Promise(resolve => {
      this.feedClient
        .send<GetUserFeedRes>(FeedEvents.GET_USER_FEED, payload)
        .subscribe(({ posts }) => {
          if (!posts.length) return resolve([]);
          return resolve(this.postRepository.findPostsByIds(posts));
        });
    });
  }

  emitPostPublished(postId: number, userId: number) {
    const payload: PostPublished = { postId, userId };
    return this.feedClient.emit(FeedEvents.POST_PUBLISHED, payload);
  }
}
