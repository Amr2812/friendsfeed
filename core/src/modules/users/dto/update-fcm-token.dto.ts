import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class updateFcmTokenDto {
  @IsString()
  @IsNotEmpty()
  newToken: string;

  @IsString()
  @IsOptional()
  oldToken: string;
}
