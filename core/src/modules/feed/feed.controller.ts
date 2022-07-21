import { Controller, Get, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { GetUser } from "@common/decorators";
import { FeedService } from "./feed.service";
import { GetFeedQueryDto } from "./dto";

@ApiTags("Feed")
@Controller("feed")
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Get("/")
  getFeed(@GetUser("id") userId: number, @Query() { limit }: GetFeedQueryDto) {
    return this.feedService.getFeed(userId, limit);
  }
}
