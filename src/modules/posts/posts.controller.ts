import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseInterceptors
} from "@nestjs/common";
import { ApiNotFoundResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { GetUser, Public } from "@common/decorators";
import { ValidateResDtoInterceptor } from "@common/interceptors/validate-res-dto.interceptor";
import { PostsService } from "./posts.service";
import {
  CreatePostDto,
  CreatePostResDto,
  GetPostByIdResDto,
  UpdatePostDto,
  UpdatePostResDto
} from "./dto";

@ApiTags("Posts")
@Controller("posts")
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseInterceptors(new ValidateResDtoInterceptor(CreatePostResDto))
  createPost(
    @GetUser("id") userId: number,
    @Body() createPostDto: CreatePostDto
  ): Promise<CreatePostResDto> {
    return this.postsService.createPost(userId, createPostDto);
  }

  @Get("/:id")
  @Public()
  @ApiOperation({ summary: "Public" })
  @UseInterceptors(new ValidateResDtoInterceptor(GetPostByIdResDto))
  @ApiNotFoundResponse({ description: "Post not found" })
  getPostById(@Param("id") postId: number): Promise<GetPostByIdResDto> {
    return this.postsService.getPost(postId);
  }

  @Patch("/:id")
  @UseInterceptors(new ValidateResDtoInterceptor(UpdatePostResDto))
  updatePost(
    @Param("id") postId: number,
    @GetUser("id") userId: number,
    @Body() updatePostDto: UpdatePostDto
  ): Promise<UpdatePostResDto> {
    return this.postsService.updatePost(postId, userId, updatePostDto);
  }

  @Delete("/:id")
  async deletePost(
    @Param("id") postId: number,
    @GetUser("id") userId: number
  ): Promise<void> {
    await this.postsService.deletePost(postId, userId);
  }
}
