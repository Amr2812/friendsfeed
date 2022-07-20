import { IsInt, IsNotEmpty } from "class-validator";

export class V1PostPublishedDto {
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @IsInt()
  @IsNotEmpty()
  postId: number;
}
