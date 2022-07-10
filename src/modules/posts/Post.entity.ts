import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { User } from "@modules/users/User.entity";
import { Comment } from "@modules/comments/Comment.entity";

@Entity("posts")
export class Post extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.posts, { eager: true })
  user: User;

  @Column()
  content: string;

  @OneToMany(() => Comment, comment => comment.post, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE"
  })
  comments: Comment[];

  @CreateDateColumn()
  createdAt: Date;
}
