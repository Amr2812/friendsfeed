import { ApiHideProperty } from "@nestjs/swagger";
import {
  BaseEntity,
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import * as bcrypt from "bcrypt";
import { Post } from "@modules/posts/Post.entity";
import { Comment } from "@modules/comments/Comment.entity";
import { Like } from "@modules/likes/Like.entity";

@Entity("users")
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @ApiHideProperty()
  @Column({ select: false })
  password: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  picture: string;

  @Column({ nullable: true })
  bio: string;

  @ApiHideProperty()
  @Column({ nullable: true, select: false })
  refreshToken: string;

  @OneToMany(() => Post, post => post.user, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE"
  })
  posts: Post[];

  @OneToMany(() => Comment, comment => comment.user, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE"
  })
  comments: Comment[];

  @OneToMany(() => Like, like => like.user, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE"
  })
  likes: Like[];

  @BeforeInsert()
  async hashPassword() {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  }

  async validatePassword(password: string) {
    return await bcrypt.compare(password, this.password);
  }
}
