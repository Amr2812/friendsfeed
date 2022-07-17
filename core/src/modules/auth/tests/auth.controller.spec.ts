import { ConfigService } from "@nestjs/config";
import { Test } from "@nestjs/testing";
import { Response } from "express";
import { User } from "@modules/users/User.entity";
import { AuthController } from "../auth.controller";
import { AuthService } from "../auth.service";
import { LoginDto, LoginResDto, SignupDto, SignupResDto } from "../dto";
import { Tokens } from "../types";

const mockConfigService: ConfigService = {
  get: jest.fn().mockImplementation((key: string) => {
    switch (key) {
      case "jwt.accessToken.expiresIn":
        return 1000 * 60 * 15;
      case "jwt.refreshToken.expiresIn":
        return 1000 * 60 * 60 * 24 * 7 * 2;
      default:
        return "";
    }
  })
} as unknown as ConfigService;

const mockCookieOptions = (token: "accessToken" | "refreshToken") => ({
  maxAge: mockConfigService.get<number>(`jwt.${token}.expiresIn`),
  httpOnly: true,
  secure: true,
  sameSite: "strict"
});

const mockTokens = (): Tokens => ({
  accessToken: "accessToken",
  refreshToken: "refreshToken"
});

const mockUser = (): User =>
  ({
    id: 1,
    email: "test@test.com",
    name: "Test user",
    picture: null,
    bio: null
  } as User);

const mockRes = (): Response =>
  ({
    cookie: jest.fn(),
    clearCookie: jest.fn()
  } as unknown as Response);

describe("AuthController", () => {
  let authController: AuthController;
  let authService: AuthService;
  let res: Response;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: {} },
        { provide: ConfigService, useValue: mockConfigService }
      ]
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    res = mockRes();
  });

  describe("signup", () => {
    it("should signup a new user", async () => {
      authService.signup = jest
        .fn()
        .mockResolvedValue({ user: mockUser(), tokens: mockTokens() });
      const mockSignupDto: SignupDto = {
        ...mockUser(),
        password: "password"
      };

      const result = await authController.signup(mockSignupDto, res);

      expect(result).toEqual<SignupResDto>(mockUser());
      expect(authService.signup).toHaveBeenCalledWith(mockSignupDto);
      expect(res.cookie).toHaveBeenCalledWith(
        "refresh_token",
        mockTokens().refreshToken,
        mockCookieOptions("refreshToken")
      );
      expect(res.cookie).toHaveBeenCalledWith(
        "access_token",
        mockTokens().accessToken,
        mockCookieOptions("accessToken")
      );
    });
  });

  describe("login", () => {
    it("should login a user", async () => {
      authService.login = jest
        .fn()
        .mockResolvedValue({ user: mockUser(), tokens: mockTokens() });
      const mockLoginDto: LoginDto = {
        email: mockUser().email,
        password: "password"
      };

      const result = await authController.login(mockLoginDto, res);

      expect(result).toEqual<LoginResDto>(mockUser());
      expect(authService.login).toHaveBeenCalledWith(mockLoginDto);
      expect(res.cookie).toHaveBeenCalledWith(
        "refresh_token",
        mockTokens().refreshToken,
        mockCookieOptions("refreshToken")
      );
      expect(res.cookie).toHaveBeenCalledWith(
        "access_token",
        mockTokens().accessToken,
        mockCookieOptions("accessToken")
      );
    });
  });

  describe("logout", () => {
    it("should logout a user", async () => {
      authService.logout = jest.fn().mockResolvedValue(null);

      await authController.logout(mockUser(), res);

      expect(authService.logout).toHaveBeenCalledWith(mockUser().id);
      expect(res.clearCookie).toHaveBeenCalledWith("refresh_token");
      expect(res.clearCookie).toHaveBeenCalledWith("access_token");
    });
  });

  describe("refresh", () => {
    it("should refresh user's tokens", async () => {
      authService.refreshTokens = jest.fn().mockResolvedValue(mockTokens());

      await authController.refreshTokens(
        { ...mockUser(), refreshToken: mockTokens().refreshToken },
        res
      );

      expect(authService.refreshTokens).toHaveBeenCalledWith(
        mockUser().id,
        mockTokens().refreshToken
      );
      expect(res.cookie).toHaveBeenCalledWith(
        "refresh_token",
        mockTokens().refreshToken,
        mockCookieOptions("refreshToken")
      );
      expect(res.cookie).toHaveBeenCalledWith(
        "access_token",
        mockTokens().accessToken,
        mockCookieOptions("accessToken")
      );
    });
  });
});
