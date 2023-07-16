import { Insertable, Selectable, Updateable } from 'kysely'

export interface Database {
  feed_posts: FeedPostTable
}

export interface FeedPostTable {
  userId: number
  postId: number
  createdAt: Date
}

export type NewFeedPost = Insertable<FeedPostTable>;
