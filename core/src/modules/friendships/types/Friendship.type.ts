import { ExcludeMethods } from "@common/types";
import { Friendship } from "../Friendship.entity";

export type FriendshipData = ExcludeMethods<Friendship>;
