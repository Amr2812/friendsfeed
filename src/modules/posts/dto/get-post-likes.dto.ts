import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsOptional, ValidateNested } from "class-validator";
import { MiniUser } from "@common/types";

export class GetPostLikesDto {
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

export class GetPostLikesResDto {
  @IsNotEmpty()
  @ValidateNested({ each: true })
  likes: { user: MiniUser }[];

  @IsNotEmpty()
  count: number;

  @IsNotEmpty()
  page: number;

  @IsNotEmpty()
  limit: number;
}
