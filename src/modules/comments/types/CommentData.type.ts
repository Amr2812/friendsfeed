import { ExcludeMethods } from "@common/types";
import { Comment } from "../Comment.entity";

export type CommentData = ExcludeMethods<Comment>;
