import { IsNotEmpty, IsOptional, ValidateNested } from "class-validator";
import { MiniUser } from "@common/types";

export class GetPostByIdResDto {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  @ValidateNested()
  user: MiniUser;

  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  createdAt: Date;

  @IsNotEmpty()
  likesCount: number;

  @IsNotEmpty()
  commentsCount: number;

  @IsOptional()
  @IsNotEmpty()
  likeId: number | null;
}
