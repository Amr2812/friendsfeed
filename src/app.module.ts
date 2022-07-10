import { APP_GUARD } from "@nestjs/core";
import { Module } from "@nestjs/common";
import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtGuard } from "@common/guards";
import { jwtConfig, storageConfig } from "./config";
import ormConfig from "../ormconfig";
import { AuthModule } from "./modules/auth/auth.module";
import { UsersModule } from "./modules/users/users.module";
import { PostsModule } from "./modules/posts/posts.module";
import { CommentsModule } from "@modules/comments/comments.module";

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
    CommentsModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtGuard
    }
  ]
})
export class AppModule {}
