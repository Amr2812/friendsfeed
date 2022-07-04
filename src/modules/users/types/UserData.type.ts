import { ExcludeMethods } from "@common/types";
import { User } from "../User.entity";

export type UserData = ExcludeMethods<User>;
