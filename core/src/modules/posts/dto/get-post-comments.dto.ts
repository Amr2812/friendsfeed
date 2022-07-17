import { IsNotEmpty, IsOptional, IsInt, ValidateNested } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { GetCommentResDto } from "./get-comment.dto";

export class GetPostCommentsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsInt()
  page: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsInt()
  limit: number;
}

export class GetPostCommentsResDto {
  @IsNotEmpty()
  @ValidateNested({ each: true })
  comments: GetCommentResDto[];

  @IsNotEmpty()
  count: number;

  @IsNotEmpty()
  page: number;

  @IsNotEmpty()
  limit: number;
}
