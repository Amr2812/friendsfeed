import { OmitType, PartialType } from "@nestjs/swagger";
import { SignupDto } from "@modules/auth/dto";
import { GetProfileResDto } from "./get-profile.dto";

export class UpdateProfileDto extends PartialType(
  OmitType(SignupDto, ["email", "password"] as const)
) {}

export class UpdateProfileResDto extends GetProfileResDto {}
