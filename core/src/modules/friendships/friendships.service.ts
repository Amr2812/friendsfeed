import {
  ConflictException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { NotificationsService } from "@modules/notifications/notifications.service";
import { GetUserFriendsDto } from "@modules/users/dto/get-user-friends.dto";
import { FriendshipRepository } from "./friendship.repository";
import { GetFriendRequestsDto } from "./dto";
import {
  FriendshipStatus,
  FriendshipStatusResponse
} from "./FriendshipStatus.enum";
import { NotificationType } from "@modules/notifications/NotificationType.enum";
import { UserRepository } from "@modules/users/user.repository";

@Injectable()
export class FriendshipsService {
  constructor(
    @InjectRepository(FriendshipRepository)
    private readonly friendshipRepository: FriendshipRepository,
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    private readonly notificationsService: NotificationsService
  ) {}

  async getFriendshipStatus(id: number, currentUserId: number) {
    let friendshipStatus: FriendshipStatusResponse;

    const friendships =
      await this.friendshipRepository.findFriendshipsOfTwoUsers(
        id,
        currentUserId
      );

    if (friendships.length === 0) {
      friendshipStatus = FriendshipStatusResponse.NOT_FRIENDS;
    } else if (
      friendships.find(f => f.receiverId == currentUserId)?.status ===
      FriendshipStatus.REJECTED
    ) {
      friendshipStatus = FriendshipStatusResponse.NOT_FRIENDS;
    } else if (
      friendships.find(f => f.senderId == currentUserId)?.status ===
      (FriendshipStatus.REJECTED || FriendshipStatus.PENDING)
    ) {
      friendshipStatus = FriendshipStatusResponse.PENDING_SENT_BY_YOU;
    } else if (
      friendships[0]?.status === FriendshipStatus.ACCEPTED ||
      friendships[1]?.status === FriendshipStatus.ACCEPTED
    ) {
      friendshipStatus = FriendshipStatusResponse.FRIENDS;
    } else if (
      friendships.find(f => f.senderId == id)?.status ===
      FriendshipStatus.PENDING
    ) {
      friendshipStatus = FriendshipStatusResponse.PENDING_SENT_BY_USER;
    }

    return friendshipStatus;
  }

  async requestFriendship(senderId: number, receiverId: number) {
    const oppositeFriendship = await this.friendshipRepository.findFriendship(
      receiverId,
      senderId
    );

    if (oppositeFriendship?.status === FriendshipStatus.ACCEPTED) {
      throw new ConflictException("You are already friends");
    } else if (oppositeFriendship?.status === FriendshipStatus.PENDING) {
      throw new ConflictException("The user sent you a friend request");
    }

    try {
      const createdFriendship =
        await this.friendshipRepository.createFriendship(senderId, receiverId);

      const { fcmTokens } = await this.userRepository.findUserById<{
        fcmTokens: string[];
      }>(receiverId, ["fcmTokens"]);

      if (fcmTokens) {
        this.notificationsService.send(
          fcmTokens,
          NotificationType.FRIEND_REQUEST,
          {
            userId: receiverId,
            fromUserId: senderId
          }
        );
      }

      return createdFriendship;
    } catch (error) {
      if (error instanceof ConflictException) {
        const friendship = await this.friendshipRepository.findFriendship(
          senderId,
          receiverId,
          {
            select: ["friendship.status"]
          }
        );

        if (friendship.status === FriendshipStatus.PENDING) {
          throw new ConflictException("Friendship request was already sent");
        } else if (friendship.status === FriendshipStatus.ACCEPTED) {
          throw new ConflictException(
            "Friendship request was already accepted"
          );
        } else if (friendship.status === FriendshipStatus.REJECTED) {
          throw new ConflictException(
            "Friendship request was already rejected"
          );
        }
      }

      throw error;
    }
  }

  getFriendshipRequests(userId: number, filter: GetFriendRequestsDto) {
    return this.friendshipRepository.findPendingFriendships(userId, filter);
  }

  async acceptFriendship(receiverId: number, senderId: number) {
    const friendship = await this.friendshipRepository.findFriendship(
      senderId,
      receiverId,
      {
        select: ["friendship.status"]
      }
    );

    if (!friendship) {
      throw new NotFoundException("Friendship request was not found");
    } else if (friendship.status === FriendshipStatus.ACCEPTED) {
      throw new ConflictException("Friendship request was already accepted");
    } else if (friendship.status === FriendshipStatus.REJECTED) {
      throw new ConflictException("Friendship request was already rejected");
    }

    await this.friendshipRepository.updateFriendship(
      senderId,
      receiverId,
      {
        status: FriendshipStatus.ACCEPTED
      }
    );

    const { fcmTokens } = await this.userRepository.findUserById<{
      fcmTokens: string[];
    }>(senderId, ["fcmTokens"]);

    if (fcmTokens) {
      this.notificationsService.send(
        fcmTokens,
        NotificationType.FRIEND_ACCEPTED,
        {
          userId: senderId,
          fromUserId: receiverId
        }
      );
    }
  }

  async rejectFriendship(receiverId: number, senderId: number) {
    const friendship = await this.friendshipRepository.findFriendship(
      senderId,
      receiverId,
      {
        select: ["friendship.status"]
      }
    );
    if (!friendship) {
      throw new NotFoundException("Friendship request was not found");
    } else if (friendship.status === FriendshipStatus.ACCEPTED) {
      throw new ConflictException("Friendship request was already accepted");
    } else if (friendship.status === FriendshipStatus.REJECTED) {
      throw new ConflictException("Friendship request was already rejected");
    }

    return this.friendshipRepository.updateFriendship(
      senderId,
      receiverId,
      {
        status: FriendshipStatus.REJECTED
      }
    );
  }

  getFriends(userId: number, filter: GetUserFriendsDto) {
    return this.friendshipRepository.findFriends(userId, filter);
  }
}
