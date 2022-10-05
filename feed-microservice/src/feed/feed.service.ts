import { Injectable } from "@nestjs/common";
import { FriendshipsService } from "src/friendships/friendships.service";
import { FeedRepository } from "./feed.repository";

@Injectable()
export class FeedService {
  constructor(
    private readonly feedRepository: FeedRepository,
    private readonly friendshipsService: FriendshipsService
  ) {}

  async addPostToUsersFeeds(postId: number, userId: number) {
    const friendsIds = await this.friendshipsService.getFriendsIds(userId);
    return this.feedRepository.prependPostToUsersFeeds(postId, friendsIds);
  }

  getUserFeed(userId: number, limit: number) {
    return this.feedRepository.findUserFeedIds(userId, limit);
  }
}
