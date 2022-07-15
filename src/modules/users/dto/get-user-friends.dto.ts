import { IsNotEmpty, IsOptional, IsInt, ValidateNested } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { MiniUserDto } from "@common/types";

export class GetUserFriendsDto {
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

export class GetUserFriendsResDto {
  @IsNotEmpty()
  @ValidateNested({ each: true })
  friends: MiniUserDto[];

  @IsNotEmpty()
  count: number;

  @IsNotEmpty()
  page: number;

  @IsNotEmpty()
  limit: number;
}
