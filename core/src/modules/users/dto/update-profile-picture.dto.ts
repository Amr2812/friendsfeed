import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class UpdateProfilePictureDto {
  @ApiProperty({
    type: "string",
    format: "binary"
  })
  @IsNotEmpty()
  file: any;
}

export class UpdateProfilePictureResDto {
  @IsNotEmpty()
  picture: string;
}
