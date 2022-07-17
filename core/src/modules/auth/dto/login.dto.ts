import { IsEmail, IsNotEmpty, IsOptional, IsString, Length } from "class-validator";

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @Length(8, 20)
  password: string;
}

export class LoginResDto {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  name: string;

  @IsOptional()
  picture?: string;

  @IsOptional()
  bio?: string;
}
