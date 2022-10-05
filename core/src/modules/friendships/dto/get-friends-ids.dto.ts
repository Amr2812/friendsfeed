import { IsInt, IsNotEmpty } from "class-validator";

export class GetFriendsIdsDto {
  @IsNotEmpty()
  @IsInt()
  userId: number;
}
