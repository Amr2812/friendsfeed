import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsInt, IsNotEmpty, IsOptional, IsPositive } from "class-validator";
import { NotificationData } from "../types";

export class GetNotificationsQueryDto {
  @ApiPropertyOptional({ type: Number, default: 10 })
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  @IsNotEmpty()
  @IsOptional()
  limit: number;
  
  @ApiPropertyOptional({ type: Number, default: 1 })
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  @IsNotEmpty()
  @IsOptional()
  page: number;
}

export class GetNotificationsResDto {
  @IsArray()
  @IsNotEmpty()
  notifications: NotificationData[];

  @IsNotEmpty()
  count: number;

  @IsNotEmpty()
  limit: number;

  @IsNotEmpty()
  page: number;
}
