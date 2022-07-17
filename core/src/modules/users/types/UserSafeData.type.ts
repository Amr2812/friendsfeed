import { ExcludeMethods } from "@common/types";
import { User } from "../User.entity";

export type UserSafeData = Pick<
  ExcludeMethods<User>,
  "id" | "name" | "email" | "picture" | "bio"
>;
