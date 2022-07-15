import { IsNotEmpty } from "class-validator";
import { MiniUserDto } from "@common/types";

export class GetCommentResDto {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  text: string;

  @IsNotEmpty()
  createdAt: Date;

  @IsNotEmpty()
  user: MiniUserDto;

  @IsNotEmpty()
  postId: number;
}
