import {
  IsNotEmpty,
  IsOptional,
  IsInt,
  ValidateNested
} from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { GetPostByIdResDto } from "../../posts/dto";

export class GetUserPostsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  search?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsInt()
  page?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsInt()
  limit?: number;
}

export class GetUserPostsResDto {
  @IsNotEmpty()
  @ValidateNested({ each: true })
  posts: GetPostByIdResDto[];

  @IsNotEmpty()
  count: number;

  @IsNotEmpty()
  page: number;

  @IsNotEmpty()
  limit: number;
}
