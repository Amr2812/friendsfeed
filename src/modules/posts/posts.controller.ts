import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
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
  UpdatePostResDto,
  CreatCommentDto,
  CreateCommentResDto,
  GetCommentResDto,
  GetPostCommentsDto,
  GetPostCommentsResDto,
  UpdateCommentDto,
  UpdateCommentResDto
} from "./dto";
import { CommentsService } from "@modules/comments/comments.service";

@ApiTags("Posts")
@Controller("posts")
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly commentsService: CommentsService
  ) {}

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

  @Post("/:id/comments")
  @UseInterceptors(new ValidateResDtoInterceptor(CreateCommentResDto))
  createComment(
    @Param("id") postId: number,
    @GetUser("id") userId: number,
    @Body() createCommentDto: CreatCommentDto
  ): Promise<CreateCommentResDto> {
    return this.commentsService.createComment(userId, postId, createCommentDto);
  }

  @Get("/:id/comments")
  @Public()
  @ApiOperation({ summary: "Public" })
  @UseInterceptors(new ValidateResDtoInterceptor(GetPostCommentsResDto))
  getComments(
    @Param("id") postId: number,
    @Query() getPostCommentsDto: GetPostCommentsDto
  ): Promise<GetPostCommentsResDto> {
    return this.commentsService.getPostComments(postId, getPostCommentsDto);
  }

  @Get("/:postId/comments/:commentId")
  @Public()
  @ApiOperation({ summary: "Public" })
  @UseInterceptors(new ValidateResDtoInterceptor(GetCommentResDto))
  @ApiNotFoundResponse({ description: "Comment not found" })
  getComment(
    @Param("postId") postId: number,
    @Param("commentId") commentId: number
  ): Promise<GetCommentResDto> {
    return this.commentsService.getComment(commentId, postId);
  }

  @Patch("/:postId/comments/:commentId")
  @UseInterceptors(new ValidateResDtoInterceptor(UpdateCommentResDto))
  @ApiNotFoundResponse({ description: "Comment not found" })
  updateComment(
    @Param("postId") postId: number,
    @Param("commentId") commentId: number,
    @GetUser("id") userId: number,
    @Body() updateCommentDto: UpdateCommentDto
  ): Promise<UpdateCommentResDto> {
    return this.commentsService.updateComment(
      commentId,
      postId,
      userId,
      updateCommentDto
    );
  }

  @Delete("/:postId/comments/:commentId")
  @ApiNotFoundResponse({ description: "Comment not found" })
  async deleteComment(
    @Param("postId") postId: number,
    @Param("commentId") commentId: number,
    @GetUser("id") userId: number
  ): Promise<void> {
    await this.commentsService.deleteComment(commentId, postId, userId);
  }
}
