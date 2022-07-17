import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PassportModule } from "@nestjs/passport";
import { UserRepository } from "@modules/users/user.repository";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy, RefreshJwtStrategy } from "./strategies";

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.register({}),
    TypeOrmModule.forFeature([UserRepository])
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RefreshJwtStrategy],
  exports: [JwtStrategy, PassportModule, AuthService]
})
export class AuthModule {}
