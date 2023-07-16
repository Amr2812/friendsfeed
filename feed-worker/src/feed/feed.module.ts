import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Pool } from "pg";
import { Kysely, PostgresDialect } from "kysely";
import { Database } from "src/types";
import { FeedController } from "./feed.controller";
import { FeedService } from "./feed.service";

@Module({
  imports: [],
  controllers: [FeedController],
  providers: [
    FeedService,
    {
      provide: "KYSELY",
      useFactory: (configService: ConfigService) => {
        const config = configService.get("postgres");
        const db = new Kysely<Database>({
          dialect: new PostgresDialect({
            pool: new Pool({
              database: config.database,
              host: config.host,
              port: config.port,
              user: config.user,
              password: config.password,
              max: 10
            })
          })
        });

        return db;
      },
      inject: [ConfigService]
    }
  ]
})
export class FeedModule {}
