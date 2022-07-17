import { FriendshipStatusResponse } from "@modules/friendships/FriendshipStatus.enum";
import { IsEnum, IsNotEmpty, IsOptional } from "class-validator";

export class GetUserByIdResDto {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  email: string;

  @IsOptional()
  picture?: string;

  @IsOptional()
  bio?: string;

  @IsNotEmpty()
  @IsEnum(FriendshipStatusResponse)
  friendshipStatus: FriendshipStatusResponse;
}
