import {
  Controller,
  Get,
  Param,
  Put,
  Patch,
  Query,
  UploadedFile,
  UseInterceptors,
  Body
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags
} from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";
import { GetUser, Public } from "@common/decorators";
import { ValidateResDtoInterceptor } from "@common/interceptors/validate-res-dto.interceptor";
import { UsersService } from "./users.service";
import {
  GetProfileResDto,
  GetUserByIdResDto,
  GetUserPostsDto,
  GetUserPostsResDto,
  UpdateProfileDto,
  UpdateProfilePictureDto,
  UpdateProfilePictureResDto,
  UpdateProfileResDto
} from "./dto";
import { PostsService } from "@modules/posts/posts.service";

@ApiTags("Users")
@Controller("users")
export class UsersController {
  constructor(
    private usersService: UsersService,
    private postsService: PostsService
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
  getUserById(@Param("id") id: number): Promise<GetUserByIdResDto> {
    return this.usersService.getUserById(id);
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
    description: "File size too large (max: 5MB) OR Invalid file type"
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

  @Get("/:id/posts")
  @Public()
  @ApiOperation({ summary: "Public" })
  @UseInterceptors(new ValidateResDtoInterceptor(GetUserPostsResDto))
  getUserPosts(
    @Param("id") userId: number,
    @Query() getUserPostsDto: GetUserPostsDto,
    @GetUser("id") currentUserId: number
  ): Promise<GetUserPostsResDto> {
    return this.postsService.getUserPosts(userId, getUserPostsDto, currentUserId);
  }
}
