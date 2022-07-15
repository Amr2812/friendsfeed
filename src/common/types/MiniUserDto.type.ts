import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class MiniUserDto {
  @ApiProperty()
  @IsNotEmpty()
  id: number;

  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsOptional()
  picture: string;
}
