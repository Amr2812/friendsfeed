import { Inject, Injectable } from "@nestjs/common";
import { Client } from "pg";

@Injectable()
export class FriendsRepository {
  constructor(
    @Inject("PG")
    private readonly pg: Client
  ) {}

  async findUserFriendsIds(userId: number): Promise<number[]> {
    const query = `
      SELECT id 
      FROM 
        (
          SELECT 
            "sender"."id" AS id, 
            "sender"."name" AS name, 
            "sender"."picture" AS picture 
          FROM 
            "friendships" "friendship" 
            LEFT JOIN "users" "sender" ON "sender"."id" = "friendship"."senderId" 
          WHERE 
            "friendship"."receiverId" = $1 
            AND "friendship"."status" = $2
        ) AS query1 
      UNION 
        (
          SELECT 
            "receiver"."id" AS id, 
            "receiver"."name" AS name, 
            "receiver"."picture" AS picture 
          FROM 
            "friendships" "friendship" 
            LEFT JOIN "users" "receiver" ON "receiver"."id" = "friendship"."receiverId" 
          WHERE 
            "friendship"."senderId" = $1 
            AND "friendship"."status" = $2
        )
    `;
    const result = await this.pg.query(query, [userId, 1]);
    return result.rows.map(row => row.id);
  }
}
