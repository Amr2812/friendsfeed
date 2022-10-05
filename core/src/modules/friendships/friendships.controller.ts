import { Controller, Get, Query, UseInterceptors } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { ApiTags } from "@nestjs/swagger";
import { ValidateResDtoInterceptor } from "@common/interceptors/validate-res-dto.interceptor";
import { GetUser } from "@common/decorators";
import { FriendshipEvents } from "./FriendshipEvents.enum";
import { FriendshipsService } from "./friendships.service";
import {
  GetFriendRequestsDto,
  GetFriendRequestsResDto,
  GetFriendsIdsDto
} from "./dto";

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

  @MessagePattern(FriendshipEvents.GET_FRIENDS_IDS)
  getFriendsIds(@Payload() data: GetFriendsIdsDto): Promise<number[]> {
    return this.friendshipsService.getFriendsIds(data.userId);
  }
}
