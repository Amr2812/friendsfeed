import { Controller } from "@nestjs/common";
import { Ctx, EventPattern, Payload, RmqContext } from "@nestjs/microservices";
import { FeedService } from "./feed.service";
import { V1PostPublishedDto } from "./dto/v1";

@Controller()
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @EventPattern("V1_post-published")
  async onPostPublished(
    @Payload() data: V1PostPublishedDto,
    @Ctx() ctx: RmqContext
  ) {
    const res = await this.feedService.addPostToUsersFeeds(
      data.postId,
      data.userId
    );

    const channel = ctx.getChannelRef();

    if (res) {
      channel.ack(ctx.getMessage());
    } else {
      channel.nack(ctx.getMessage());
    }
  }
}
