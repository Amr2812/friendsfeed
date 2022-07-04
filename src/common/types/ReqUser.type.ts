import { User } from "@modules/users/User.entity";

export type ReqUser = Pick<User, "id" | "email">;
