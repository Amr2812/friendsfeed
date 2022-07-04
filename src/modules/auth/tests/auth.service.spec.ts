import { ConflictException, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import * as argon2 from "argon2";
import { ReqUser } from "@common/types";
import { UserRepository } from "@modules/users/user.repository";
import { UserSafeData } from "@modules/users/types";
import { Tokens } from "../types";
import { AuthService } from "../auth.service";
import { LoginDto } from "../dto";

const mockConfigService: ConfigService = {
  get: jest.fn().mockImplementation((key: string) => {
    switch (key) {
      case "jwt.accessToken.secret":
        return "jwtSecret";
      case "jwt.accessToken.expiresIn":
        return 1000 * 60 * 15; // 15 minutes
      case "jwt.refreshToken.secret":
        return "refreshJwtSecret";
      case "jwt.refreshToken.expiresIn":
        return 1000 * 60 * 60 * 24 * 7 * 2; // 2 weeks
      default:
        return "";
    }
  })
} as unknown as ConfigService;

const mockJwtService: JwtService = {
  signAsync: jest.fn().mockResolvedValue("jwtToken")
} as unknown as JwtService;

const mockUser = (): Partial<UserSafeData> => ({
  id: 1,
  email: "test@test.com",
  name: "Test User",
  picture: null,
  bio: null
});

const mockReqUser = (): ReqUser => ({
  id: 1,
  email: "test@test.com"
});

const mockUserCredentials = (): LoginDto => ({
  email: "test@test.com",
  password: "testPassword"
});

const mockTokens = (): Tokens => ({
  accessToken: "accessToken",
  refreshToken: "refreshToken"
});

const mockHashedRefreshToken = (): string => "hashedRefreshToken";

describe("AuthService", () => {
  let authService: AuthService;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserRepository, useValue: {} },
        { provide: JwtService, useValue: mockJwtService },
        {
          provide: ConfigService,
          useValue: mockConfigService
        }
      ]
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  describe("signup", () => {
    let user: Partial<UserSafeData>;
    beforeEach(() => {
      authService.getTokens = jest.fn().mockReturnValue(mockTokens());
      authService.updateRefreshToken = jest.fn().mockResolvedValue(true);
      user = mockUser();
      user.id = undefined;
    });

    it("should sign up a user and return user and tokens", async () => {
      userRepository.createUser = jest.fn().mockResolvedValue(mockUser());

      const result = await authService.signup(user);

      expect(userRepository.createUser).toHaveBeenCalledWith(user);
      expect(authService.getTokens).toHaveBeenCalledWith(mockUser());
      expect(authService.updateRefreshToken).toHaveBeenCalledWith(
        mockUser().id,
        mockTokens().refreshToken
      );
      expect(result).toEqual({
        user: mockUser(),
        tokens: mockTokens()
      });
    });

    it("should throw an error if email already exists", async () => {
      userRepository.createUser = jest
        .fn()
        .mockRejectedValue(new ConflictException("Email already exists"));

      expect(authService.signup(user)).rejects.toThrow(ConflictException);
      expect(userRepository.createUser).toHaveBeenCalledWith(user);
      expect(authService.getTokens).not.toHaveBeenCalled();
      expect(authService.updateRefreshToken).not.toHaveBeenCalled();
    });
  });

  describe("login", () => {
    beforeEach(() => {
      authService.getTokens = jest.fn().mockResolvedValue(mockTokens());
      authService.updateRefreshToken = jest.fn().mockResolvedValue(true);
    });

    it("should login a user and return user and tokens", async () => {
      userRepository.validateUserPassword = jest
        .fn()
        .mockResolvedValue(mockUser());

      const result = await authService.login(mockUserCredentials());

      expect(userRepository.validateUserPassword).toHaveBeenCalledWith(
        mockUserCredentials()
      );
      expect(authService.getTokens).toHaveBeenCalledWith(mockUser());
      expect(authService.updateRefreshToken).toHaveBeenCalledWith(
        mockUser().id,
        mockTokens().refreshToken
      );
      expect(result).toEqual({
        user: mockUser(),
        tokens: mockTokens()
      });
    });

    it("should throw an error if user does not exist", () => {
      userRepository.validateUserPassword = jest.fn().mockResolvedValue(null);

      expect(authService.login(mockUserCredentials())).rejects.toThrow(
        UnauthorizedException
      );
      expect(userRepository.validateUserPassword).toHaveBeenCalledWith(
        mockUserCredentials()
      );
      expect(authService.getTokens).not.toHaveBeenCalled();
      expect(authService.updateRefreshToken).not.toHaveBeenCalled();
    });
  });

  describe("logout", () => {
    it("should logout a user", () => {
      userRepository.updateUser = jest.fn().mockResolvedValue(true);

      expect(authService.logout(mockReqUser().id)).resolves;
      expect(userRepository.updateUser).toHaveBeenCalledWith(mockUser().id, {
        refreshToken: null
      });
    });
  });

  describe("refreshTokens", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      authService.getTokens = jest.fn().mockResolvedValue(mockTokens());
      authService.updateRefreshToken = jest.fn().mockResolvedValue(true);
    });

    it("should refresh a user's tokens", async () => {
      userRepository.findUserById = jest.fn().mockResolvedValue({
        id: mockReqUser().id,
        email: mockReqUser().email,
        refreshToken: mockHashedRefreshToken()
      });
      jest.spyOn(argon2, "verify").mockResolvedValue(true);

      const result = await authService.refreshTokens(
        mockReqUser().id,
        mockTokens().refreshToken
      );

      expect(result).toEqual(mockTokens());
      expect(userRepository.findUserById).toHaveBeenCalledWith(
        mockReqUser().id,
        ["id", "refreshToken", "email"]
      );
      expect(argon2.verify).toHaveBeenCalledWith(
        mockTokens().refreshToken,
        mockHashedRefreshToken()
      );
      expect(authService.getTokens).toHaveBeenCalledWith({
        id: mockReqUser().id,
        email: mockReqUser().email,
        refreshToken: mockHashedRefreshToken()
      });
      expect(authService.updateRefreshToken).toHaveBeenCalledWith(
        mockUser().id,
        mockTokens().refreshToken
      );
    });

    it("should throw an error if refresh token doesn't exist", async () => {
      userRepository.findUserById = jest.fn().mockResolvedValue(null);
      jest.spyOn(argon2, "verify").mockResolvedValue(true);

      expect(
        authService.refreshTokens(mockReqUser().id, mockTokens().refreshToken)
      ).rejects.toThrow(UnauthorizedException);
      expect(userRepository.findUserById).toHaveBeenCalledWith(
        mockReqUser().id,
        ["id", "refreshToken", "email"]
      );
      expect(argon2.verify).not.toHaveBeenCalled();
      expect(authService.getTokens).not.toHaveBeenCalled();
      expect(authService.updateRefreshToken).not.toHaveBeenCalled();
    });

    it("should throw an error if refresh token doesn't match the hashed one", async () => {
      userRepository.findUserById = jest.fn().mockResolvedValue({
        id: mockReqUser().id,
        email: mockReqUser().email,
        refreshToken: mockHashedRefreshToken()
      });
      jest.spyOn(argon2, "verify").mockResolvedValue(false);

      await expect(
        authService.refreshTokens(mockReqUser().id, mockTokens().refreshToken)
      ).rejects.toThrow(UnauthorizedException);
      expect(userRepository.findUserById).toHaveBeenCalledWith(
        mockReqUser().id,
        ["id", "refreshToken", "email"]
      );
      expect(argon2.verify).toHaveBeenCalledWith(
        mockTokens().refreshToken,
        mockHashedRefreshToken()
      );
      expect(authService.getTokens).not.toHaveBeenCalled();
      expect(authService.updateRefreshToken).not.toHaveBeenCalled();
    });
  });

  describe("getTokens", () => {
    it("should generate tokens for a user", async () => {
      const result = await authService.getTokens({
        id: mockUser().id,
        email: mockUser().email
      });
      expect(result).toEqual({
        accessToken: "jwtToken",
        refreshToken: "jwtToken"
      });
    });
  });

  describe("updateRefreshToken", () => {
    it("should update a user's refresh token", async () => {
      jest.spyOn(argon2, "hash").mockResolvedValue(mockHashedRefreshToken());

      userRepository.updateUser = jest.fn().mockResolvedValue(true);

      const result = await authService.updateRefreshToken(
        mockUser().id,
        mockTokens().refreshToken
      );

      expect(result).resolves;
      expect(argon2.hash).toHaveBeenCalledWith(
        mockTokens().refreshToken
      );
      expect(userRepository.updateUser).toHaveBeenCalledWith(mockUser().id, {
        refreshToken: mockHashedRefreshToken()
      });
    });
  });
});
