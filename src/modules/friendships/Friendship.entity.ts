import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  BaseEntity,
  JoinColumn,
  Index
} from "typeorm";
import { User } from "@modules/users/User.entity";
import { FriendshipStatus } from "./FriendshipStatus.enum";

@Entity()
@Index(["senderId", "receiverId"], { unique: true })
export class Friendship extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  senderId: number;

  @Index()
  @Column()
  receiverId: number;

  @ManyToOne(() => User, user => user.senderFriendships)
  @JoinColumn({ name: "senderId" })
  sender: User;

  @ManyToOne(() => User, user => user.receiverFriendships)
  @JoinColumn({ name: "receiverId" })
  receiver: User;

  @Column({
    enum: FriendshipStatus,
    default: FriendshipStatus.PENDING
  })
  status: FriendshipStatus;

  @CreateDateColumn()
  createdAt: Date;
}
