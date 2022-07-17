import { IsNotEmpty, IsOptional, ValidateNested } from "class-validator";
import { MiniUserDto } from "@common/types";

export class GetPostByIdResDto {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  @ValidateNested()
  user: MiniUserDto;

  @IsNotEmpty()
  text: string;

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
