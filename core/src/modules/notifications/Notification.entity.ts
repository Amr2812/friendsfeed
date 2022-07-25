import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { User } from "@modules/users/User.entity";
import { NotificationType } from "./NotificationType.enum";
import { Post } from "@modules/posts/Post.entity";
import { Comment } from "@modules/comments/Comment.entity";
import { Like } from "@modules/likes/Like.entity";

@Entity("notifications")
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ enum: NotificationType })
  type: NotificationType;

  @Column({ default: false })
  read: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, user => user.notifications)
  user: User;

  @Column()
  userId: number;

  @ManyToOne(() => User)
  fromUser: User;

  @Column()
  fromUserId: number;

  @ManyToOne(() => Post)
  post: Post;

  @Column({ nullable: true })
  postId: number;

  @ManyToOne(() => Comment)
  comment: Comment;

  @Column({ nullable: true })
  commentId: number;

  @ManyToOne(() => Like)
  like: Like;

  @Column({ nullable: true })
  likeId: number;
}
