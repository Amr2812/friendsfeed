import {
  Body,
  Controller,
  Delete,
  Post,
  Res,
  UseGuards,
  HttpCode,
  HttpStatus,
  UseInterceptors
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  ApiConflictResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse
} from "@nestjs/swagger";
import { Response } from "express";
import { ValidateResDtoInterceptor } from "@common/interceptors/validate-res-dto.interceptor";
import { GetUser, Public } from "@common/decorators";
import { RefreshJwtGuard } from "@common/guards";
import { ReqUser } from "@common/types";
import { AuthService } from "./auth.service";
import { LoginDto, LoginResDto, SignupDto, SignupResDto } from "./dto";
import { UserWithRefreshToken } from "./types";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly configService: ConfigService
  ) {}

  @Post("/signup")
  @Public()
  @ApiOperation({ summary: "Public" })
  @UseInterceptors(new ValidateResDtoInterceptor(SignupResDto))
  @ApiConflictResponse({ description: "email already exists" })
  async signup(
    @Body() signupDto: SignupDto,
    @Res({ passthrough: true }) res: Response
  ): Promise<SignupResDto> {
    const { user, tokens } = await this.authService.signup(signupDto);

    res.cookie("refresh_token", tokens.refreshToken, {
      maxAge: this.configService.get<number>("jwt.refreshToken.expiresIn"),
      httpOnly: true,
      sameSite: "strict"
    });
    res.cookie("access_token", tokens.accessToken, {
      maxAge: this.configService.get<number>("jwt.accessToken.expiresIn"),
      httpOnly: true,
      sameSite: "strict"
    });

    return user;
  }

  @Post("/login")
  @Public()
  @ApiOperation({ summary: "Public" })
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(new ValidateResDtoInterceptor(LoginResDto))
  @ApiUnauthorizedResponse({ description: "Invalid credentials" })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response
  ): Promise<LoginResDto> {
    const { tokens, user } = await this.authService.login(loginDto);

    res.cookie("refresh_token", tokens.refreshToken, {
      maxAge: this.configService.get<number>("jwt.refreshToken.expiresIn"),
      httpOnly: true,
      sameSite: "strict"
    });
    res.cookie("access_token", tokens.accessToken, {
      maxAge: this.configService.get<number>("jwt.accessToken.expiresIn"),
      httpOnly: true,
      sameSite: "strict"
    });

    return user;
  }

  @Delete("/logout")
  async logout(
    @GetUser() user: ReqUser,
    @Res({ passthrough: true }) res: Response
  ): Promise<void> {
    await this.authService.logout(user.id);
    res.clearCookie("refresh_token");
    res.clearCookie("access_token");

    return;
  }

  @Post("/refresh")
  @Public()
  @ApiOperation({ summary: "Public" })
  @UseGuards(RefreshJwtGuard)
  @HttpCode(HttpStatus.OK)
  @ApiUnauthorizedResponse({ description: "Access denied" })
  async refreshTokens(
    @GetUser() user: UserWithRefreshToken,
    @Res({ passthrough: true }) res: Response
  ): Promise<void> {
    const { accessToken, refreshToken } = await this.authService.refreshTokens(
      user.id,
      user.refreshToken
    );

    res.cookie("refresh_token", refreshToken, {
      maxAge: this.configService.get<number>("jwt.refreshToken.expiresIn"),
      httpOnly: true,
      sameSite: "strict"
    });
    res.cookie("access_token", accessToken, {
      maxAge: this.configService.get<number>("jwt.accessToken.expiresIn"),
      httpOnly: true,
      sameSite: "strict"
    });

    return;
  }
}
