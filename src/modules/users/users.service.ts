import { Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { CloudStorageService } from "@common/providers";
import { UserRepository } from "./user.repository";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private storageService: CloudStorageService,
    private readonly configService: ConfigService
  ) {}

  async getUserById(id: number) {
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
}
