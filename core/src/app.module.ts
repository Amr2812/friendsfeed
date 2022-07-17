import { APP_GUARD } from "@nestjs/core";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { JwtGuard } from "@common/guards";
import { CommentsModule } from "@modules/comments/comments.module";
import { FriendshipsModule } from "@modules/friendships/friendships.module";
import { jwtConfig, storageConfig } from "./config";
import ormConfig from "../ormconfig";
import { AuthModule } from "./modules/auth/auth.module";
import { UsersModule } from "./modules/users/users.module";
import { PostsModule } from "./modules/posts/posts.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [jwtConfig, storageConfig]
    }),
    TypeOrmModule.forRoot(ormConfig),
    AuthModule,
    UsersModule,
    PostsModule,
    CommentsModule,
    FriendshipsModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtGuard
    }
  ]
})
export class AppModule {}
