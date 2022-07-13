import { PartialType } from "@nestjs/swagger";
import { CreatePostDto } from "./create-post.dto";
import { GetPostByIdResDto } from "./get-post-by-id.dto";

export class UpdatePostDto extends PartialType(CreatePostDto) {}

export class UpdatePostResDto extends GetPostByIdResDto {}
