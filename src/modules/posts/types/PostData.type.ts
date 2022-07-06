import { ExcludeMethods } from "@common/types";
import { Post } from "../Post.entity";

export type PostData = ExcludeMethods<Post>;
