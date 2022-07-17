import { Controller, Get, Query, UseInterceptors } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ValidateResDtoInterceptor } from "@common/interceptors/validate-res-dto.interceptor";
import { GetUser } from "@common/decorators";
import { FriendshipsService } from "./friendships.service";
import { GetFriendRequestsDto, GetFriendRequestsResDto } from "./dto";

@ApiTags("Friendships")
@Controller("friendships")
export class FriendshipsController {
  constructor(private readonly friendshipsService: FriendshipsService) {}

  @Get("/requests")
  @UseInterceptors(new ValidateResDtoInterceptor(GetFriendRequestsResDto))
  getFriendRequests(
    @GetUser("id") userId: number,
    @Query() getFriendRequestsDto: GetFriendRequestsDto
  ): Promise<GetFriendRequestsResDto> {
    return this.friendshipsService.getFriendshipRequests(
      userId,
      getFriendRequestsDto
    );
  }
}
