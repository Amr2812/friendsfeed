import {
  Controller,
  Get,
  Param,
  Patch,
  UploadedFile,
  UseInterceptors
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiTags
} from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";
import { GetUser } from "@common/decorators";
import { ValidateResDtoInterceptor } from "@common/interceptors/validate-res-dto.interceptor";
import { UsersService } from "./users.service";
import {
  GetProfileResDto,
  GetUserByIdResDto,
  UpdateProfilePictureDto,
  UpdateProfilePictureResDto
} from "./dto";

@ApiTags("Users")
@Controller("users")
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get("/me")
  @UseInterceptors(new ValidateResDtoInterceptor(GetProfileResDto))
  getProfile(@GetUser("id") userId: number): Promise<GetProfileResDto> {
    return this.usersService.getUserById(userId);
  }

  @Get("/:id")
  @UseInterceptors(new ValidateResDtoInterceptor(GetUserByIdResDto))
  getUserById(@Param("id") id: number): Promise<GetUserByIdResDto> {
    return this.usersService.getUserById(id);
  }

  @Patch("/me/picture")
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
}
