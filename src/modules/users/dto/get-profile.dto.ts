import { IsNotEmpty, IsOptional } from "class-validator";

export class GetProfileResDto {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  email: string;

  @IsOptional()
  picture: string;
}
