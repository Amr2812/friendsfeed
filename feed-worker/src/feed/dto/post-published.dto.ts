import { IsArray, IsInt, IsNotEmpty, IsNotEmptyObject } from "class-validator";

export class PostPublishedDto {
  @IsInt()
  @IsNotEmpty()
  postId: number;

  @IsArray()
  @IsNotEmpty()
  friendsIds: number[];
}
