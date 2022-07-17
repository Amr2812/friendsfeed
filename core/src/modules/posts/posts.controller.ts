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
import {
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags
} from "@nestjs/swagger";
import { GetUser, Public } from "@common/decorators";
import { ValidateResDtoInterceptor } from "@common/interceptors/validate-res-dto.interceptor";
import { PostsService } from "./posts.service";
import {
  CreatePostDto,
  CreatePostResDto,
  GetPostByIdResDto,
  UpdatePostDto,
  UpdatePostResDto,
  CreateCommentDto,
  CreateCommentResDto,
  GetCommentResDto,
  GetPostCommentsDto,
  GetPostCommentsResDto,
  UpdateCommentDto,
  UpdateCommentResDto,
  GetPostLikesDto,
  GetPostLikesResDto
} from "./dto";
import { CommentsService } from "@modules/comments/comments.service";
import { LikesService } from "@modules/likes/likes.service";

@ApiTags("Posts")
@Controller("posts")
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly commentsService: CommentsService,
    private readonly likesService: LikesService
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
  getPostById(
    @Param("id") postId: number,
    @GetUser("id") userId: number
  ): Promise<GetPostByIdResDto> {
    return this.postsService.getPost(postId, userId);
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
    @Body() createCommentDto: CreateCommentDto
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

  @Post("/:id/likes")
  @ApiConflictResponse({ description: "You have already liked this post" })
  @ApiNotFoundResponse({ description: "Post or user not found" })
  async likePost(
    @Param("id") postId: number,
    @GetUser("id") userId: number
  ): Promise<void> {
    await this.likesService.likePost(postId, userId);
  }

  @Get("/:id/likes")
  @Public()
  @ApiOperation({ summary: "Public" })
  @UseInterceptors(new ValidateResDtoInterceptor(GetPostLikesResDto))
  async getLikes(
    @Param("id") postId: number,
    @Query() getPostLikesDto: GetPostLikesDto
  ): Promise<GetPostLikesResDto> {
    return this.likesService.getPostLikes(postId, getPostLikesDto);
  }

  @Delete("/:postId/likes/:likeId")
  @ApiNotFoundResponse({ description: "You haven't liked this post" })
  async unlikePost(
    @Param("postId") postId: number,
    @Param("likeId") likeId: number,
    @GetUser("id") userId: number
  ): Promise<void> {
    await this.likesService.unlikePost(postId, likeId, userId);
  }
}
