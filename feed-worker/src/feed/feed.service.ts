import { Inject, Injectable } from "@nestjs/common";
import { Kysely } from "kysely";
import { Database } from "src/types";

@Injectable()
export class FeedService {
  constructor(
    @Inject("KYSELY")
    private readonly db: Kysely<Database>
  ) {}

  addPostToUsersFeeds(postId: number, friendsIds: number[]) {
    return this.db
      .insertInto("feed_posts")
      .values(
        friendsIds.map(id => ({
          postId,
          userId: id
        }))
      )
      .execute();
  }
}
