import { Controller } from "@nestjs/common";
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext
} from "@nestjs/microservices";
import { FeedService } from "./feed.service";
import { GetUserFeedDto, GetUserFeedResDto, PostPublishedDto } from "./dto";
import { FeedEvents } from "./FeedEvents.enum";

@Controller()
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @EventPattern(FeedEvents.PostPublished)
  async onPostPublished(
    @Payload() data: PostPublishedDto,
    @Ctx() ctx: RmqContext
  ) {
    const success = await this.feedService.addPostToUsersFeeds(
      data.postId,
      data.userId
    );

    const channel = ctx.getChannelRef();

    if (success) {
      channel.ack(ctx.getMessage());
    } else {
      channel.nack(ctx.getMessage());
    }
  }

  @MessagePattern(FeedEvents.GetUserFeed)
  getUserFeed(@Payload() data: GetUserFeedDto): Promise<GetUserFeedResDto> {
    return this.feedService.getUserFeed(data.userId, data.limit);
  }
}
