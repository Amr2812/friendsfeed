import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MulterModule } from "@nestjs/platform-express";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CloudStorageService, GCStorage } from "@common/providers";
import { PostsService } from "@modules/posts/posts.service";
import { LikesService } from "@modules/likes/likes.service";
import { FriendshipRepository } from "@modules/friendships/friendship.repository";
import { FriendshipsService } from "@modules/friendships/friendships.service";
import { FeedModule } from "@modules/feed/feed.module";
import { PostsModule } from "@modules/posts/posts.module";
import { LikesModule } from "@modules/likes/likes.module";
import { PostRepository } from "@modules/posts/posts.repository";
import { LikeRepository } from "@modules/likes/likes.repository";
import { UserRepository } from "./user.repository";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserRepository,
      FriendshipRepository,
      PostRepository,
      LikeRepository
    ]),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        storage: new GCStorage(configService, {
          destination: (req, file, cb) => {
            cb(null, {
              name: req.user["id"]
                .toString()
                .replace(/\s/g, "_")
                .concat(`_${Date.now().toString()}`),
              folder: configService.get("storage.usersFoler")
            });
          },
          fileType: "image"
        })
      }),
      inject: [ConfigService]
    }),
    FeedModule,
    PostsModule,
    LikesModule
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    CloudStorageService,
    PostsService,
    LikesService,
    FriendshipsService
  ]
})
export class UsersModule {}
