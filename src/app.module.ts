import { APP_GUARD } from "@nestjs/core";
import { Module } from "@nestjs/common";
import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthModule } from "./modules/auth/auth.module";
import { typeOrmConfig, jwtConfig, storageConfig } from "./config";
import { JwtGuard } from "@common/guards";
import { UsersModule } from "./modules/users/users.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeOrmConfig, jwtConfig, storageConfig]
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return configService.get<TypeOrmModuleOptions>("typeOrm", {
          infer: true
        });
      },
      inject: [ConfigService]
    }),
    UsersModule,
    AuthModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtGuard
    }
  ]
})
export class AppModule {}
