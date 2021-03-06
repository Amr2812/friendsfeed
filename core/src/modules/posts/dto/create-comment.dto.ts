import { Length } from "class-validator";
import { GetCommentResDto } from "./get-comment.dto";

export class CreateCommentDto {
  @Length(1, 400)
  text: string;
}

export class CreateCommentResDto extends GetCommentResDto {}
