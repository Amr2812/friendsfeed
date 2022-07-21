import { IsInt, IsNotEmpty } from "class-validator";

export class PostPublishedDto {
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @IsInt()
  @IsNotEmpty()
  postId: number;
}
