import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class MiniUser {
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

export * from "./create-post.dto";
export * from "./get-post-by-id.dto";
export * from "./update-post.dto";
