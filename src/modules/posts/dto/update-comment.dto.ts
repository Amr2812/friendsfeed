import { PartialType } from "@nestjs/swagger";
import { CreateCommentDto } from "./create-comment.dto";
import { GetCommentResDto } from "./get-comment.dto";

export class UpdateCommentDto extends PartialType(CreateCommentDto) {}

export class UpdateCommentResDto extends GetCommentResDto {}
