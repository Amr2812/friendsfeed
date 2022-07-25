import {
  Controller,
  Get,
  Param,
  Put,
  Patch,
  Query,
  UploadedFile,
  UseInterceptors,
  Body,
  Post,
  HttpCode,
  HttpStatus,
  ParseIntPipe
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiConsumes,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags
} from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";
import { GetUser, Public } from "@common/decorators";
import { ValidateResDtoInterceptor } from "@common/interceptors/validate-res-dto.interceptor";
import { PostsService } from "@modules/posts/posts.service";
import { FriendshipsService } from "@modules/friendships/friendships.service";
import { UsersService } from "./users.service";
import {
  GetProfileResDto,
  GetUserByIdResDto,
  GetUserPostsDto,
  GetUserPostsResDto,
  updateFcmTokenDto,
  UpdateProfileDto,
  UpdateProfilePictureDto,
  UpdateProfilePictureResDto,
  UpdateProfileResDto
} from "./dto";
import {
  GetUserFriendsDto,
  GetUserFriendsResDto
} from "./dto/get-user-friends.dto";

@ApiTags("Users")
@Controller("users")
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly postsService: PostsService,
    private readonly friendshipsService: FriendshipsService
  ) {}

  @Get("/me")
  @UseInterceptors(new ValidateResDtoInterceptor(GetProfileResDto))
  getProfile(@GetUser("id") userId: number): Promise<GetProfileResDto> {
    return this.usersService.getUserById(userId);
  }

  @Get("/:id")
  @Public()
  @ApiOperation({ summary: "Public" })
  @UseInterceptors(new ValidateResDtoInterceptor(GetUserByIdResDto))
  getUserById(
    @Param("id") id: number,
    @GetUser("id") currentUserId: number
  ): Promise<GetUserByIdResDto> {
    return this.usersService.getUserById(id, currentUserId || null);
  }

  @Put("/me/picture")
  @UseInterceptors(FileInterceptor("file"))
  @UseInterceptors(new ValidateResDtoInterceptor(UpdateProfilePictureResDto))
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    description: "Update user profile picture",
    type: UpdateProfilePictureDto
  })
  @ApiBadRequestResponse({
    description: `
      File size too large (max: 5MB)
      Invalid file type
      `
  })
  async updatePicture(
    @GetUser() userId: number,
    @UploadedFile() file: { publicUrl: string }
  ): Promise<UpdateProfilePictureResDto> {
    const { picture } = await this.usersService.updatePicture(userId, file);

    return { picture };
  }

  @Patch("/me")
  @UseInterceptors(new ValidateResDtoInterceptor(UpdateProfileResDto))
  updateProfile(
    @GetUser("id") userId: number,
    @Body() dto: UpdateProfileDto
  ): Promise<UpdateProfileResDto> {
    return this.usersService.updateProfile(userId, dto);
  }

  @Patch("/me/fcm-token")
  async updateFcmToken(
    @GetUser("id", ParseIntPipe) userId: number,
    @Body() dto: updateFcmTokenDto
  ): Promise<void> {
    await this.usersService.updateFcmToken(
      userId,
      dto.newToken,
      dto.oldToken || null
    );
  }

  @Get("/:id/posts")
  @Public()
  @ApiOperation({ summary: "Public" })
  @UseInterceptors(new ValidateResDtoInterceptor(GetUserPostsResDto))
  getUserPosts(
    @Param("id") userId: number,
    @Query() getUserPostsDto: GetUserPostsDto,
    @GetUser("id") currentUserId: number
  ): Promise<GetUserPostsResDto> {
    return this.postsService.getUserPosts(
      userId,
      getUserPostsDto,
      currentUserId
    );
  }

  @Post("/:id/friends/add")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNotFoundResponse({ description: "User not found" })
  @ApiConflictResponse({
    description: `
      You are already friends
      The user sent you a friend request
      Friendship request was already sent
      Friendship request was already accepted
      Friendship request was already rejected
      `
  })
  async addFriend(
    @GetUser("id") senderId: number,
    @Param("id") receiverId: number
  ): Promise<void> {
    await this.friendshipsService.requestFriendship(senderId, receiverId);
  }

  @Post("/:id/friendships/accept")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNotFoundResponse({
    description: "Friendship request not found"
  })
  @ApiConflictResponse({
    description: `
      Friendship request was already accepted
      Friendship request was already rejected
    `
  })
  async acceptFriend(
    @GetUser("id") receiverId: number,
    @Param("id") senderId: number
  ): Promise<void> {
    await this.friendshipsService.acceptFriendship(receiverId, senderId);
  }

  @Post("/:id/friendships/reject")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNotFoundResponse({
    description: "Friendship request not found"
  })
  @ApiConflictResponse({
    description: `
      Friendship request was already sent
      Friendship request was already accepted
      Friendship request was already rejected
    `
  })
  async rejectFriend(
    @GetUser("id") receiverId: number,
    @Param("id") senderId: number
  ): Promise<void> {
    await this.friendshipsService.rejectFriendship(receiverId, senderId);
  }

  @Get("/:id/friends")
  @Public()
  @ApiOperation({ summary: "Public" })
  @ApiNotFoundResponse({
    description: "User not found"
  })
  @UseInterceptors(new ValidateResDtoInterceptor(GetUserFriendsResDto))
  getFriends(
    @Param("id") userId: number,
    @Query() query: GetUserFriendsDto
  ): Promise<GetUserFriendsResDto> {
    return this.friendshipsService.getFriends(userId, query);
  }
}
