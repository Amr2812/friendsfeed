import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { JwtService } from "@nestjs/jwt";
import * as argon2 from "argon2";
import { UserRepository } from "@modules/users/user.repository";
import { UserData, UserSafeData } from "@modules/users/types";
import { JwtPayload } from "./types/JwtPayload.interface";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async signup(user: Partial<UserData>) {
    const createdUser = await this.userRepository.createUser(user);

    const tokens = await this.getTokens(createdUser);
    await this.updateRefreshToken(createdUser.id, tokens.refreshToken);

    return { user: createdUser, tokens };
  }

  async login(userCredentials: Pick<UserData, "email" | "password">) {
    const user = await this.userRepository.validateUserPassword(
      userCredentials
    );

    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const tokens = await this.getTokens(user);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return { tokens, user };
  }

  async logout(userId: number) {
    await this.userRepository.updateUser(userId, { refreshToken: null });
  }

  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.userRepository.findUserById<{
      id: number;
      email: string;
      refreshToken: string;
    }>(userId, ["id", "refreshToken", "email"]);

    if (!user?.refreshToken) throw new UnauthorizedException("Access denied");

    const refreshTokenMatch = await argon2.verify(
      refreshToken,
      user.refreshToken
    );

    if (!refreshTokenMatch) {
      throw new UnauthorizedException("Access denied");
    }

    const tokens = await this.getTokens(user);
    await this.updateRefreshToken(userId, tokens.refreshToken);
    return tokens;
  }

  async getTokens(user: Pick<UserSafeData, "id" | "email">) {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>("jwt.accessToken.secret"),
        expiresIn: this.configService.get<number>("jwt.accessToken.expiresIn")
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>("jwt.refreshToken.secret"),
        expiresIn: this.configService.get<number>("jwt.refreshToken.expiresIn")
      })
    ]);

    return { accessToken, refreshToken };
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    const hash = await argon2.hash(refreshToken);

    await this.userRepository.updateUser(userId, {
      refreshToken: hash
    });
  }
}
