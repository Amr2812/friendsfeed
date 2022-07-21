import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive
} from "class-validator";

export class GetFeedQueryDto {
  @ApiPropertyOptional({ type: Number, default: 10 })
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  @IsNotEmpty()
  @IsOptional()
  limit: number;
}

export class GetFeedResDto {
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  userId: number;

  @IsArray()
  @IsNotEmpty()
  feed: number[];
}
