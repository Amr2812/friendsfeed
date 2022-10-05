import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { FriendshipEvents } from "./FriendshipEvents.enum";
import { GetFriendsIds } from "./interfaces";

@Injectable()
export class FriendshipsService {
  constructor(
    @Inject("FRIENDSHIPS_SERVICE")
    private readonly friendshipsClient: ClientProxy
  ) {}

  getFriendsIds(userId: number): Promise<number[]> {
    const payload: GetFriendsIds = { userId };
    return new Promise(resolve => {
      this.friendshipsClient
        .send<number[]>(FriendshipEvents.GET_FRIENDS_IDS, payload)
        .subscribe(ids => {
          return resolve(ids);
        });
    });
  }
}
