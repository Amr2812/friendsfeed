import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { User } from "@modules/users/User.entity";
import { Post } from "@modules/posts/Post.entity";

@Entity("comments")
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.comments, { eager: true })
  user: User;

  @Column()
  text: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Post, post => post.comments)
  post: Post;

  @Column()
  postId: number;
}