import { IsNotEmpty, ValidateNested } from "class-validator";
import { MiniUser } from ".";

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
}
