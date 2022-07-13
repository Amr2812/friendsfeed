import { ConflictException } from "@nestjs/common";
import { EntityRepository, Repository } from "typeorm";
import { User } from "./User.entity";
import { UserData, UserSafeData } from "./types";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(user: Partial<UserData>): Promise<UserSafeData> {
    const createdUser = this.create(user);

    try {
      await this.insert(createdUser);
    } catch (error) {
      if (error.code == "23505") {
        throw new ConflictException("Email already exists");
      }

      throw error;
    }

    createdUser.password = undefined;
    createdUser.refreshToken = undefined;
    return createdUser;
  }

  async findSafeUserById(id: number): Promise<UserSafeData> {
    const user = await this.findOne(id, {
      select: ["id", "name", "email", "picture", "bio"]
    });
    return user;
  }

  async findUserById<T extends Partial<UserData>>(
    id: number,
    select: (keyof UserData)[]
  ) {
    const user = await this.findOne(id, { select });
    return user as unknown as T;
  }

  async updateUser(id: number, data: Partial<UserData>, returnUser = false) {
    const res = await this.update(id, data);

    if (returnUser) {
      return this.findSafeUserById(id);
    }

    return res;
  }

  async validateUserPassword(
    userCredentials: Partial<UserData>
  ): Promise<UserData | null> {
    const { email, password } = userCredentials;
    const user = await this.findOne(
      { email },
      { select: ["id", "name", "email", "picture", "password", "bio"] }
    );

    if (user && (await user.validatePassword(password))) {
      user.password = undefined;
      return user;
    }

    return null;
  }
}
