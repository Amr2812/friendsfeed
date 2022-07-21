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
      SELECT * 
      FROM 
        (
          SELECT 
            "senderId" AS id 
          FROM 
            "friendships" "friendship" 
          WHERE 
            "friendship"."receiverId" = $1 
            AND "friendship"."status" = $2
        ) AS query1 
      UNION 
        (
          SELECT 
            "receiverId" AS id 
          FROM 
            "friendships" "friendship" 
          WHERE 
            "friendship"."senderId" = $1 
            AND "friendship"."status" = $2
        )
    `;
    const result = await this.pg.query(query, [userId, 1]);
    return result.rows.map(row => row.id);
  }
}
