import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { Strategy, ExtractJwt } from "passport-jwt";
import { UserRepository } from "@modules/users/user.repository";
import { JwtPayload, UserWithRefreshToken } from "../types";

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  "refresh-jwt"
) {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req.cookies["refresh_token"]
      ]),
      secretOrKey: configService.get("jwt.refreshToken.secret"),
      passReqToCallback: true
    });
  }

  async validate(
    req: Request,
    payload: JwtPayload
  ): Promise<UserWithRefreshToken> {
    const user = await this.userRepository.findSafeUserById(payload.sub);

    if (!user) {
      throw new UnauthorizedException();
    }

    return {
      ...user,
      refreshToken: req.cookies["refresh_token"]
    };
  }
}
