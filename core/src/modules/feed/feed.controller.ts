import { Controller, Get, Query, UseInterceptors } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { GetUser } from "@common/decorators";
import { ValidateResDtoInterceptor } from "@common/interceptors/validate-res-dto.interceptor";
import { FeedService } from "./feed.service";
import { GetFeedDto, GetFeedResDto } from "./dto";

@ApiTags("Feed")
@Controller("feed")
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Get("/")
  @UseInterceptors(new ValidateResDtoInterceptor(GetFeedResDto))
  getFeed(
    @GetUser("id") userId: number,
    @Query() { limit }: GetFeedDto
  ): Promise<GetFeedResDto> {
    return this.feedService.getFeed(userId, limit);
  }
}
