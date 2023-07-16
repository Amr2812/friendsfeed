import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn
} from "typeorm";
import { User } from "@modules/users/User.entity";
import { Post } from "@modules/posts/Post.entity";

@Entity("feed_posts")
export class FeedPost extends BaseEntity {
  @PrimaryColumn()
  userId: number;

  @PrimaryColumn()
  postId: number;

  @ManyToOne(() => User, { primary: true })
  user: User;

  @ManyToOne(() => Post, { primary: true })
  post: Post;

  @CreateDateColumn()
  createdAt: Date;
}
