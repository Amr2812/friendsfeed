import { DeepPartial, EntityRepository, Repository } from "typeorm";
import { GetNotificationsQueryDto } from "./dto";
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

  findNotificationById(id: number): Promise<NotificationData> {
    return this.createQueryBuilder("notification")
      .leftJoinAndSelect("notification.fromUser", "fromUser")
      .select([
        "notification.id",
        "notification.type",
        "notification.userId",
        "fromUser.id",
        "fromUser.name",
        "fromUser.picture",
        "notification.postId",
        "notification.commentId",
        "notification.likeId"
      ])
      .where("notification.id = :id", { id })
      .getOne();
  }

  async findNotificationsByUserId(
    userId: number,
    query: GetNotificationsQueryDto
  ): Promise<{
    notifications: NotificationData[];
    count: number;
    limit: number;
    page: number;
  }> {
    const limit = query.limit || 10;
    const page = query.page || 1;

    let [notifications, count] = await this.createQueryBuilder("notification")
      .leftJoinAndSelect("notification.fromUser", "fromUser")
      .select([
        "notification.id",
        "notification.type",
        "notification.read",
        "notification.createdAt",
        "fromUser.id",
        "fromUser.name",
        "fromUser.picture",
        "notification.postId",
        "notification.commentId",
        "notification.likeId"
      ])
      .where("notification.userId = :userId", { userId })
      .orderBy("notification.createdAt", "DESC")
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    if (notifications.length) {
      this.createQueryBuilder("notification")
        .update(Notification)
        .set({ read: true })
        .where("userId = :userId", { userId })
        .andWhere("read = false")
        .execute();
    }

    notifications = notifications.map(notification => {
      if (notification.postId === null) {
        notification.postId = undefined;
      }
      if (notification.commentId === null) {
        notification.commentId = undefined;
      }
      if (notification.likeId === null) {
        notification.likeId = undefined;
      }

      return notification;
    });

    return {
      notifications,
      count,
      limit,
      page
    };
  }
}
