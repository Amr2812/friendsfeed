import { NotificationType } from "../NotificationType.enum";

export type NotificationData = {
  id: number;
  type: NotificationType;
  read: boolean;
  fromUser: {
    id: number;
    name: string;
    picture: string;
  };
  userId?: number;
  postId?: number;
  commentId?: number;
  likeId?: number;
};
