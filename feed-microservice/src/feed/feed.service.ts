import { Injectable } from "@nestjs/common";
import { FeedRepository, FriendsRepository } from "./repositories";

@Injectable()
export class FeedService {
  constructor(
    private readonly feedRepository: FeedRepository,
    private readonly friendsRepository: FriendsRepository
  ) {}

  async addPostToUsersFeeds(postId: number, userId: number) {
    const friends = await this.friendsRepository.findUserFriendsIds(userId);
    return this.feedRepository.prependPostToUsersFeeds(postId, friends);
  }

  getUserFeed(userId: number, limit: number) {
    return this.feedRepository.findUserFeedIds(userId, limit);
  }
}
