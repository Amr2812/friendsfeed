import { DeepPartial, EntityRepository, Repository } from "typeorm";
import { Notification } from "./Notification.entity";
import { NotificationData } from "./types";

@EntityRepository(Notification)
export class NotificationRepository extends Repository<Notification> {
  async createNotification(
    userId: number,
    fromUserId: number,
    notification: Partial<NotificationData>,
    postId?: number
  ): Promise<DeepPartial<NotificationData>> {
    const createdNotification = this.create({
      userId,
      fromUserId,
      ...notification,
      postId: postId || undefined
    });

    await this.insert(createdNotification);

    return this.findNotificationById(createdNotification.id);
  }

  findNotificationById(id: number): Promise<{
    id: number;
    type: NotificationData["type"];
    userId: number;
    fromUser: {
      id: number;
      name: string;
      picture: string;
    };
    postId?: number;
    commentId?: number;
    likeId?: number;
  }> {
    return this.createQueryBuilder("notification")
      .leftJoinAndSelect("notification.fromUser", "fromUser")
      .select([
        "notification.id",
        "notification.type",
        "notification.userId",
        "notification.fromUser.id",
        "notification.fromUser.name",
        "notification.fromUser.picture",
        "notification.postId",
        "notification.commentId",
        "notification.likeId"
      ])
      .where("notification.id = :id", { id })
      .getOne();
  }
}
