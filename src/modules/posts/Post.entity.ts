import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { User } from "@modules/users/User.entity";

@Entity("posts")
export class Post extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.posts, { eager: true })
  user: User;

  @Column()
  content: string;

  @CreateDateColumn()
  createdAt: Date;
}
