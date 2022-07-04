import { IsNotEmpty, IsOptional } from "class-validator";

export class GetUserByIdResDto {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  email: string;

  @IsOptional()
  picture: string;
}
