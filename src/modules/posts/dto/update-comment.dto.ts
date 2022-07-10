import { Length } from "class-validator";
import { GetCommentResDto } from "./get-comment.dto";

export class UpdateCommentDto {
  @Length(1, 400)
  text: string;
}

export class UpdateCommentResDto extends GetCommentResDto {}
