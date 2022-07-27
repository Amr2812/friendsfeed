import { IsNotEmpty } from "class-validator";

export class GetUnreadNotificationsCountResDto {
  @IsNotEmpty()
  count: number;
}
