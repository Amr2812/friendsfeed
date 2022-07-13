import { ExcludeMethods } from "@common/types";
import { User } from "../User.entity";

export type UserSafeData = Omit<
  ExcludeMethods<User>,
  "password" | "refreshToken" | "posts" | "comments" | "likes"
>;
