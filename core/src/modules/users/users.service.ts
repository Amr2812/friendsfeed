import { Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { CloudStorageService } from "@common/providers";
import { FriendshipsService } from "@modules/friendships/friendships.service";
import { FriendshipStatusResponse } from "@modules/friendships/FriendshipStatus.enum";
import { UserRepository } from "./user.repository";
import { UserData, UserSafeData } from "./types";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    private readonly storageService: CloudStorageService,
    private readonly configService: ConfigService,
    private readonly friendshipsService: FriendshipsService
  ) {}

  async getUserById(id: number, currentUserId?: number) {
    let friendshipStatus: FriendshipStatusResponse =
      FriendshipStatusResponse.NOT_FRIENDS;

    if (currentUserId && currentUserId != id) {
      const [user, friendshipStatusResponse] = await Promise.all([
        this.userRepository.findSafeUserById(id),
        this.friendshipsService.getFriendshipStatus(id, currentUserId)
      ]);
      if (!user) throw new NotFoundException("User not found");

      friendshipStatus = friendshipStatusResponse;
      return {
        ...user,
        friendshipStatus
      };
    }

    const user = await this.userRepository.findSafeUserById(id);
    if (!user) throw new NotFoundException("User not found");

    return user;
  }

  async updatePicture(userId: number, file: { publicUrl: string }) {
    const userToUpdate = await this.userRepository.findUserById<{
      picture: string;
    }>(userId, ["picture"]);

    if (userToUpdate.picture) {
      this.storageService.deleteFile(
        this.configService.get("storage.usersFolder"),
        userToUpdate.picture
      );
    }

    await this.userRepository.updateUser(userId, {
      picture: file.publicUrl
    });

    return { picture: file.publicUrl };
  }

  updateProfile(userId: number, profile: Partial<UserData>) {
    return this.userRepository.updateUser(
      userId,
      profile,
      true
    ) as Promise<UserSafeData>;
  }

  async updateFcmToken(userId: number, newToken: string, oldToken?: string) {
    console.log("updateFcmToken", userId, newToken, oldToken);
    const user = await this.userRepository.findUserById<{
      id: number;
      fcmTokens: string[];
    }>(userId, ["id", "fcmTokens"]);

    if (!user) throw new NotFoundException("User not found");

    if (oldToken && user.fcmTokens?.includes(oldToken)) {
      user.fcmTokens = user.fcmTokens.filter(token => token !== oldToken);
    }

    if (!user.fcmTokens?.length) {
      user.fcmTokens = [newToken];
    } else {
      user.fcmTokens.push(newToken);
    }

    return this.userRepository.updateUser(userId, {
      fcmTokens: user.fcmTokens
    });
  }
}
