import { GetPostByIdResDto } from "@modules/posts/dto";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  ValidateNested
} from "class-validator";

export class GetFeedDto {
  @ApiPropertyOptional({ type: Number, default: 10 })
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  @IsNotEmpty()
  @IsOptional()
  limit: number;
}

export class GetFeedResDto {
  @IsArray()
  @ValidateNested({ each: true })
  posts: GetPostByIdResDto[];
}
