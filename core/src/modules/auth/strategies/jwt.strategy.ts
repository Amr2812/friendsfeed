import { ForbiddenException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { Strategy, ExtractJwt } from "passport-jwt";
import { ReqUser } from "@common/types";
import { JwtPayload } from "../types/JwtPayload.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req.cookies["access_token"]
      ]),
      secretOrKey: configService.get("jwt.accessToken.secret")
    });
  }

  async validate(payload: JwtPayload) {
    if (payload.exp < Date.now() / 1000) {
      throw new ForbiddenException("Token has expired");
    }

    const user: ReqUser = {
      id: payload.sub,
      email: payload.email
    };
    return user;
  }
}
