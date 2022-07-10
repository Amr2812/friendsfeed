import { IsNotEmpty } from "class-validator";
import { MiniUser } from ".";

export class GetCommentResDto {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  text: string;

  @IsNotEmpty()
  createdAt: Date;

  @IsNotEmpty()
  user: MiniUser;

  @IsNotEmpty()
  postId: number;
}
