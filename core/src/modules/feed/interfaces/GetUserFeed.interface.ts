export interface GetUserFeed {
  userId: number;
  limit?: number;
}

export interface GetUserFeedRes {
  userId: number;
  posts: number[];
}
