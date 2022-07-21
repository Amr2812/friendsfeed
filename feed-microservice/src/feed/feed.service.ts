import { Injectable } from "@nestjs/common";
import { FeedRepository } from "./repositories";

@Injectable()
export class FeedService {
  constructor(private readonly feedRepository: FeedRepository) {}

  addPostToUsersFeeds(postId: number, userId: number) {
    return this.feedRepository.prependPostToUsersFeeds(postId, userId);
  }

  getUserFeed(userId: number, limit: number) {
    return this.feedRepository.findUserFeedIds(userId, limit);
  }
}
