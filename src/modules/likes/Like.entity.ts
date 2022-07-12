import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { User } from "@modules/users/User.entity";
import { Post } from "@modules/posts/Post.entity";

@Entity("posts_likes")
export class Like extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.likes, { eager: true })
  user: User;

  @ManyToOne(() => Post, post => post.likes)
  post: Post;

  @Column()
  postId: number;
}
