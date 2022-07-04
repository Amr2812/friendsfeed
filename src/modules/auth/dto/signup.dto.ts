import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length
} from "class-validator";

export class SignupDto {
  @IsString()
  @Length(3, 25)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @Length(8, 20)
  password: string;

  @IsString()
  @IsOptional()
  bio?: string;
}

export class SignupResDto {
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
}
