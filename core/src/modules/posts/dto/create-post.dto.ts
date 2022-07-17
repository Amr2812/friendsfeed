import { Length } from "class-validator";
import { GetPostByIdResDto } from "./get-post-by-id.dto";

export class CreatePostDto {
  @Length(1, 3000)
  text: string;
}

export class CreatePostResDto extends GetPostByIdResDto {}
