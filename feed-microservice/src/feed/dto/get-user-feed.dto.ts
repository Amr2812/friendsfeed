import { IsInt, IsNotEmpty, IsOptional, IsPositive } from "class-validator";

export class GetUserFeedDto {
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @IsInt()
  @IsPositive()
  @IsOptional()
  limit: number;
}

export class GetUserFeedResDto {
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @IsInt()
  @IsNotEmpty()
  posts: number[];
}
