import { ApiHideProperty } from "@nestjs/swagger";
import {
  BaseEntity,
  BeforeInsert,
  Column,
  Entity,
  PrimaryGeneratedColumn
} from "typeorm";
import * as bcrypt from "bcrypt";

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

  @BeforeInsert()
  async hashPassword() {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  }

  async validatePassword(password: string) {
    return await bcrypt.compare(password, this.password);
  }
}
