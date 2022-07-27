import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial } from "typeorm";
import * as firebase from "firebase-admin";
import { MessagingPayload } from "firebase-admin/lib/messaging/messaging-api";
import { NotificationType } from "./NotificationType.enum";
import { NotificationRepository } from "./notitification.repository";
import { NotificationData } from "./types";
import { GetNotificationsQueryDto } from "./dto";

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger("NotificationsService");
  private readonly fcm: firebase.messaging.Messaging;

  constructor(
    @InjectRepository(NotificationRepository)
    private readonly notificationRepository: NotificationRepository,
    private readonly configService: ConfigService
  ) {
    this.fcm = firebase
      .initializeApp({
        credential: firebase.credential.cert(
          JSON.parse(this.configService.get("FCM_KEY"))
        )
      })
      .messaging();
  }

  async send(
    tokenOrTokens: string | string[],
    type: NotificationType,
    data: {
      userId: number;
      fromUserId: number;
      postId?: number;
      commentId?: number;
      likeId?: number;
    }
  ): Promise<void> {
    const notification = await this.notificationRepository.createNotification(
      data.userId,
      data.fromUserId,
      { type },
      data.postId
    );

    const payload = this.getPayload(type, notification);

    this.fcm.sendToDevice(tokenOrTokens, payload).catch(error => {
      this.logger.error(error.message, { error, payload });
    });
  }

  getNotifications(userId: number, query: GetNotificationsQueryDto) {
    return this.notificationRepository.findNotificationsByUserId(userId, query);
  }

  async getUnreadNotificationsCount(userId: number) {
    const count =
      await this.notificationRepository.findUnreadNotificationsCount(userId);
    
    return { count };
  }

  protected getPayload(
    type: NotificationType,
    notification: DeepPartial<NotificationData>
  ): MessagingPayload {
    let payload: MessagingPayload;
    switch (type) {
      case NotificationType.FRIEND_REQUEST:
        payload = {
          notification: {
            title: "Friend request",
            body: `${notification.fromUser.name} wants to be your friend!`
          },
          data: {
            type: NotificationType.FRIEND_REQUEST,
            fromUserId: String(notification.fromUser.id),
            fromUserName: notification.fromUser.name
          }
        };
        break;

      case NotificationType.FRIEND_ACCEPTED:
        payload = {
          notification: {
            title: "Friend request accepted",
            body: `${notification.fromUser.name} is now your friend!`
          },
          data: {
            type: NotificationType.FRIEND_ACCEPTED,
            fromUserId: String(notification.fromUser.id),
            fromUserName: notification.fromUser.name
          }
        };
        break;

      case NotificationType.POST_LIKE:
        payload = {
          notification: {
            title: "New like",
            body: `${notification.fromUser.name} liked your post!`
          },
          data: {
            type: NotificationType.POST_LIKE,
            fromUserId: String(notification.fromUser.id),
            fromUserName: notification.fromUser.name
          }
        };
        break;

      case NotificationType.POST_COMMENT:
        payload = {
          notification: {
            title: "New comment",
            body: `${notification.fromUser.name} commented on your post!`
          },
          data: {
            type: NotificationType.POST_COMMENT,
            fromUserId: String(notification.fromUser.id),
            fromUserName: notification.fromUser.name
          }
        };
        break;

      default:
        throw new Error("Unknown notification type");
    }

    if (notification.fromUser.picture) {
      payload.notification.icon = notification.fromUser.picture;
      payload.data.fromUserPicture = notification.fromUser.picture;
    }

    if (notification.postId) {
      payload.data.postId = String(notification.postId);
    }

    if (notification.commentId) {
      payload.data.commentId = String(notification.commentId);
    }

    if (notification.likeId) {
      payload.data.likeId = String(notification.likeId);
    }

    return payload;
  }
}
