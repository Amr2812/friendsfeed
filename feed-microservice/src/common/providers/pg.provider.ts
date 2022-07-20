import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Client } from "pg";

@Injectable()
export class PGProvider {
  private readonly logger = new Logger("PGProvider");
  private readonly pg: Client;

  constructor(private readonly configService: ConfigService) {
    this.pg = new Client({
      host: this.configService.get("pg.host"),
      port: this.configService.get("pg.port"),
      user: this.configService.get("pg.user"),
      password: this.configService.get("pg.password"),
      database: this.configService.get("pg.database")
    });
  }

  async init() {
    try {
      await this.pg.connect();
      this.logger.log("PG is ready");
    } catch (err) {
      this.logger.error(err);
    }
  }

  getPG(): Client {
    return this.pg;
  }
}
