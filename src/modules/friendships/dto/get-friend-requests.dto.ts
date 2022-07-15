import { IsNotEmpty, IsOptional, IsInt, ValidateNested } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { MiniUserDto } from "@common/types";

export class GetFriendRequestsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  search?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsInt()
  page?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsInt()
  limit?: number;
}

export class GetFriendRequestsResDto {
  @IsNotEmpty()
  @ValidateNested({ each: true })
  requests: FriendRequest[];

  @IsNotEmpty()
  count: number;

  @IsNotEmpty()
  page: number;

  @IsNotEmpty()
  limit: number;
}

class FriendRequest {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  createdAt: Date;

  @ValidateNested()
  sender: MiniUserDto;
}
